const taskService = require('./task_service');
const GlobalHelper = require('../../helper/helper');
class task_controller {
    static create_task = async (req, res) => {
        try {
        let create_task = await taskService.create_task(req);
          GlobalHelper.handleSuccess(res, create_task);
        } catch (err) {
          GlobalHelper.handleCatch(res, err);
        }
    };
    
    static edit_task = async (req, res) => {
        try {
        let edit_task = await taskService.edit_task(req);
          GlobalHelper.handleSuccess(res, edit_task);
        } catch (err) {
          GlobalHelper.handleCatch(res, err);
        }
    };
    
    static get_tasks = async (req, res) => {
        try {
        let get_tasks = await taskService.get_tasks(req);
          GlobalHelper.handleSuccess(res, get_tasks);
        } catch (err) {
          GlobalHelper.handleCatch(res, err);
        }
    };
    
    static get_task_detail = async (req, res) => {
        try {
        let get_task_detail = await taskService.get_task_details(req);
          GlobalHelper.handleSuccess(res, get_task_detail);
        } catch (err) {
          GlobalHelper.handleCatch(res, err);
        }
      };

    
      static delete_task = async (req, res) => {
        try {
        let delete_task = await taskService.delete_task(req);
          GlobalHelper.handleSuccess(res, delete_task);
        } catch (err) {
          GlobalHelper.handleCatch(res, err);
        }
  };

  static change_status = async (req, res) => {
    try {
      console.log("chaneg statua")
    let data = await taskService.change_status(req);
      GlobalHelper.handleSuccess(res, data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static assign_task = async (req, res) => {
    try {
      console.log("asign task")
    let delete_task = await taskService.assign_task(req);
      GlobalHelper.handleSuccess(res, delete_task);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  
  

    
}

module.exports = task_controller;