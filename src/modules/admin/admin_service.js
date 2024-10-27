const Models  = require('../../models/index')
const GlobalHelper = require('../../helper/helper');
const DAO = require('../../DAO/query')
const { Types } = require('mongoose');
const EmailService = require("../../helper/email.service");
const { populate } = require('../../models/notification_model');
const ERROR_MESSAGES = require("../../config/error");

class admin_service{
    static create_manager =async (req) => {
        try {
            let email_;
            if (req.body.email) email_ = req.body.email.toLowerCase().trim();
            let query = { email: email_  }; 
            let user_exist = await DAO.getData(Models.Users,query, {__v:0},{lean:true});
            if (user_exist.length) {
              if (email_ == user_exist?.[0]?.email) {
                await GlobalHelper.handleCustomError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
              } 
            }
            let {
                name,
                country_code,
                phone_no,
                email,
                password,
                fcm_token,
              } = req.body;
              let _password = await GlobalHelper.bcryptPassword(password);
              let otp = await GlobalHelper.generateOtp();
              let phone_otp = await GlobalHelper.generateOtp();
              let save_data = {
                name: name ? name.trim() : null,
                country_code: country_code ? country_code.trim() : null,
                phone_no: phone_no ? phone_no.trim() : null,
                email: email_,
                password: _password,
                otp: otp,
                roles: "MANAGER",
                created_at: +new Date(),
              };
              let data = await DAO.saveData(Models.Users, save_data);
              //send email
              await EmailService.welcomeEmail(data);
              return { message: `Created successfully`, data };
        } catch (error) {
            throw error
        }
  }

  static list_manager = async (req) => {
    try {
      let { pagination, limit, search } = req.query;
      let query = {roles:"MANAGER"};
      if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }];
    }
      let projection = { name:1, email:1, phone_no :1 }
      let options = await GlobalHelper.setOptions(Number(pagination), Number(limit));
      let data = await DAO.getData(Models.Users, query, projection, options);
      let count = await DAO.countDocument(Models.Users, query);
      return {
        data,
        count
      }
    } catch (error) {
      throw error;
    }
  }
  
  static create_team = async (req) => {
    try {
      let { name, description, manager, members, created_at } = req.body;
      let data_to_save = {
        name, 
        description,
        manager,
        members,
        created_at : +new Date()
      }
      let saved_data = await DAO.saveData(Models.Teams, data_to_save);
      return { message:'Team created successfully', data:saved_data};
    } catch (error) {
      throw error;
    }
  }

  
  static list_team = async (req) => {
    try {
      let { pagination, limit, search } = req.query;
      let query = {};
      if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }];
    }
      let projection = { __v: 0 };
      let options = await GlobalHelper.setOptions(Number(pagination), Number(limit));
      let populate_to = [{path:"manager", select:"_id name  email country_code phone"}]
      let data = await DAO.populateData(Models.Teams, query, projection, options,populate_to)
      let count = await DAO.countDocument(Models.Teams, query);
      return {
        data,
        count
      }
    } catch (error) {
      throw error;
    }
  }

  static list_member = async (req) => {
    try {
      let { pagination, limit, search } = req.query;
      let { _id: team_id } = req.params;
      let query = { _id: new Types.ObjectId(team_id) };
      let team = await DAO.getSingleData(Models.Teams, query, { members:1 }, { lean: true });
      let user_query = { _id: { $in: [team.members] } }
      if (search) {
        user_query.$or = [{ name: { $regex: search, $options: "i" } }];
      }
      let projection = { _id:1, name:1, email:1, country_code:1, phone_no:1 };
      let options = await GlobalHelper.setOptions(Number(pagination), Number(limit));
      let data = await DAO.getData(Models.Users, user_query, projection, options)
      let count = await DAO.countDocument(Models.Users, user_query);
      return {
        data,
        count
      }
    } catch (error) {
      throw error;
    }
  }

  // making flow only admin can add member in a team because manager have only his team user access;
  static add_member = async (req) => {
    try {
      let { _id: team_id } = req.params;
      let { user_id } = req.body;
      let query = {
        _id: new Types.ObjectId(team_id)
      }
      let update = { $addToSet: { members: new Types.ObjectId(user_id) } };
      let options = { new: true }
      let data = await DAO.findAndUpdate(Models.Teams, query, update, options);
      return { message:"member added successfully", data}
    } catch (error) {
      throw error;
    }
  }

  static remove_member = async (req) => {
    try {
      let { _id: team_id } = req.params;
      let { user_id } = req.body;
      let query = {
        _id: new Types.ObjectId(team_id)
      }
      let update = { $pull: { members: new Types.ObjectId(user_id) } }
      let options = { new: true }
      let data = await DAO.findAndUpdate(Models.Teams, query, update, options);
      return { message:"member added successfully", data}
    } catch (error) {
      throw error;
    }
  }
}

module.exports = admin_service;
