const GlobalHelper  = require( "../../helper/helper");
const UserService = require('./user_service')

class UserController {
  static signUp = async (req, res) => {
    try {
      let signup = await UserService.signUp(req);
      GlobalHelper.handleSuccess(res, signup);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static verifyEmail = async (req, res) => {
    try {
      let response = await UserService.verifyEmail(req);
      GlobalHelper.handleSuccess(res, response);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static login = async (req, res) => {
    try {
      let login = await UserService.login(req);
      GlobalHelper.handleSuccess(res, login);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static logout = async (req, res) => {
    try {
      let get_profile = await UserService.logout(req);
      GlobalHelper.handleSuccess(res, get_profile);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static getProfile = async (req, res) => {
    try {
      let get_profile = await UserService.getProfile(req);
      GlobalHelper.handleSuccess(res, get_profile);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static editProfile = async (req, res) => {
    try {
      let profile = await UserService.editProfile(req);
      GlobalHelper.handleSuccess(res, profile);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static resendEmailOtp = async (req, res) => {
    try {
      let get_data = await UserService.resendEmailOtp(req);
      GlobalHelper.handleSuccess(res, get_data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static changePassword = async (req, res) => {
    try {
      let get_data = await UserService.changePassword(req);
      GlobalHelper.handleSuccess(res, get_data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static forgotPassword = async (req, res) => {
    try {
      let get_data = await UserService.forgotPassword(req);
      GlobalHelper.handleSuccess(res, get_data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static forgotPasswordVerifyOtp = async (req, res) => {
    try {
      let get_data = await UserService.forgotPasswordVerifyOtp(req);
      GlobalHelper.handleSuccess(res, get_data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static resetPassword = async (req, res) => {
    try {
      let get_data = await UserService.resetPassword(req);
      GlobalHelper.handleSuccess(res, get_data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

  static getOtherUser = async (req, res) => {
    try {
      let get_data = await UserService.getOtherUser(req);
      GlobalHelper.handleSuccess(res, get_data);
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

}

module.exports = UserController;