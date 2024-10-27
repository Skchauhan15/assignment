const adminService = require('./admin_service');
const GlobalHelper = require('../../helper/helper');
const  ERROR_MESSAGES  = require("../../config/error");

class task_controller {
    static create_manager = async (req, res) => {
      try {
          console.log("create manager")
        let create_manager = await adminService.create_manager(req);
          GlobalHelper.handleSuccess(res, create_manager);
        } catch (err) {
          GlobalHelper.handleCatch(res, err);
        }
  };

  static list_manager = async (req, res) => {
    try {
    let data = await adminService.list_manager(req);
      GlobalHelper.handleSuccess(res, data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  static create_team = async (req, res) => {
    try {
    let data = await adminService.create_team(req);
      GlobalHelper.handleSuccess(res, data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static list_team = async (req, res) => {
    try {
    let data = await adminService.list_team(req);
      GlobalHelper.handleSuccess(res, data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static list_member = async (req, res) => {
    try {
    let data = await adminService.list_member(req);
      GlobalHelper.handleSuccess(res, data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  static add_member = async (req, res) => {
    try {
    let data = await adminService.add_member(req);
      GlobalHelper.handleSuccess(res, data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  static remove_member = async (req, res) => {
    try {
    let data = await adminService.remove_member(req);
      GlobalHelper.handleSuccess(res, data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
};
  
}

module.exports = task_controller;