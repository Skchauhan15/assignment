const Models  = require('../../models/index')
const GlobalHelper = require('../../helper/helper');
const DAO = require('../../DAO/query')
const { Types } = require('mongoose');
const EmailService = require('../../helper/email.service');
const  ERROR_MESSAGES  = require("../../config/error");
const { emitTaskAssigned  } = require("./socketio");
const moment = require("moment")
class task_service {
    static create_task = async (req) => {
        try {
            let { title, description, due_date, priority } = req.body;
            let data = {
                title,
                description,
                due_date,
                priority,
                created_at: +new Date()
            }
            return await DAO.saveData(Models.Tasks,data)
        } catch (err) {
            throw err
        }
    };

    static edit_task = async (req) => {
        try {
            let { _id } = req.params;
            let { title, description, due_date, priority, status } = req.body;
            let update = {
                title,
                description,
                due_date,
                priority,
                status
            }
            let query = { _id: new Types.ObjectId(_id) }
            let options = { new:true }
            let updated_data = await DAO.findAndUpdate(Models.Tasks, query, update, options)
            return updated_data;
        } catch (err) {
            throw err
        }
    };

    static get_tasks = async (req) => {
        try {
            let { status, search, pagination, limit, due_date, priority } = req.query;
            console.log(req.query)
            let { _id, roles } = req.user_data;
            let query = {};
            if (roles == "USER") {
                query.assign_to = new Types.ObjectId(_id)
           }
            if (status) {
                query.status = status;
            }
            if (priority) {
                query.priority = priority;
            }
            if (search) {
                query.$or = [{ title: { $regex: search, $options: "i" } }];
            }
            if (due_date) {
                let start_time = moment(Number(due_date)).startOf('day').valueOf();
                let end_time = moment(Number(due_date)).endOf('day').valueOf();
                
                console.log("Start Time in ms:", start_time);
                console.log("End Time in ms:", end_time);
                console.log("start_time", start_time)
                console.log("ednd_time", end_time)
                query.due_date = { $gt: start_time, $lt: end_time }
            }
            let options = await GlobalHelper.setOptions(
                Number(pagination),
                Number(limit)
              );
            let projection = { __v: 0 };
            console.log(query)
            let data = await DAO.getData(Models.Tasks, query, projection, options)
            let count = await DAO.countDocument(Models.Tasks,query)
            return {
              data,
              count
            }
        } catch (err) {
            throw err;
        }
    };

    static get_task_details = async (req) => {
        try {
            let { _id } = req.params;
            let query = { _id: new Types.ObjectId(_id) }
            let projection = { __v: 0 }
            let options = { lean: true }
            return await DAO.getSingleData(Models.Tasks, query, projection, options)
        } catch (err) {
            throw err
        }
    };

    static delete_task = async (req) => {
        try {
            let { _id } = req.params;
            let query = {_id:new Types.ObjectId(_id)}
            await DAO.removeOne(Models.Tasks, query); 
            return { message:"Deleted successfully"}
        } catch (err) {
            throw err
        }
    };

    static assign_task = async (req) => {
        try {
            let { _id } = req.params;
            let {_id:user_id } = req.user_data;
            let { assign_to } = req.body; 
            let query = {_id:new Types.ObjectId(_id)}
            let update = {
                assign_to,
                assign_by: user_id
            };
            let options = { new: true };
            let updated_data = await DAO.findAndUpdate(Models.Tasks, query, update, options); 
            console.log("updated _data", updated_data)
            if (updated_data) {
                let user = await DAO.getSingleData(Models.Users, {_id: user_id}, { __v:0 }, { lean: true })
                let assign_to_query = { _id: updated_data.assign_to}
                let assigned_user = await DAO.getSingleData(Models.Users, assign_to_query, {_id:1, email:1, socket_id:1 }, { lean: true });
                let email_data = { email: assigned_user.email, user_name: user.name, title: updated_data.title }
                EmailService.TaskAssignEmail(email_data) 
                let data_to_save = {
                    sent_by:user._id,
                    sent_to:assigned_user._id,
                    message: "A new task assigned to you",
                    title: "Task Assign",
                }
                DAO.saveData(Models.Notifications,data_to_save)
                // Emit a socket event to the assigned user
                emitTaskAssigned(assigned_user?.socket_id,{
                     message: 'A new task has been assigned to you.',
                     task_id: _id,
                     title: updated_data.title,
                     assigned_by: user.name
                 });
            }
            return updated_data;
        } catch (err) {
            throw err
        }
    };

    static change_status = async (req) => {
        try {
            let { _id } = req.params;
            let { _id: user_id, roles } = req.user_data;
            let { status } = req.body;
            let query = {_id:new Types.ObjectId(_id)}
            if (roles == "USER") {
                query.assign_to = user_id
            }
            let update = {
                status
            };
            let options = { new: true };
            let task_data = await DAO.findAndUpdate(Models.Tasks,query, update, options);
            if (!task_data) await GlobalHelper.handleCustomError(ERROR_MESSAGES.NOT_FOUND);
            let user = await DAO.getSingleData(Models.Users, {_id: user_id}, { __v:0 }, { lean: true })
            if (roles == "USER") {
                let assign_by_query = { _id: task_data.assign_by }
                let fetch_other_user = await DAO.getSingleData(Models.Users, assign_by_query, { email:1  }, { lean: true });
                let email_data = { email: fetch_other_user.email, user_name: user.name, title: task_data.title }
                console.log("emai_data", email_data)
                EmailService.TaskUpdateEmail(email_data)
            } else {
                let assign_to_query = { _id: task_data.assign_to}
                let fetch_other_user = await DAO.getSingleData(Models.Users, assign_to_query, { email:1  }, { lean: true });
                let email_data = { email: fetch_other_user.email, user_name: user.name, title: task_data.title }
                console.log("user_data", email_data)
                EmailService.TaskUpdateEmail(email_data)  
            }
            return task_data;
        } catch (err) {
            
            throw err
        }
    };

}

module.exports = task_service;