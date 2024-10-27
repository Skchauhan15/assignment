const Models = require("../../models");
const DAO = require("../../DAO/query");
const common = require("./user_common");
const ERROR_MESSAGES  = require("../../config/error");
const GlobalHelper = require("../../helper/helper");
const EmailService = require("../../helper/email.service");
const { query } = require("express");
const { Types } = require("mongoose");
// const jwt = require("jsonwebtoken");

let projection = { __v: 0 };
let options = { lean: true };
let options_new = { new: true };

class UserService {
  static signUp = async (req) => {
    let email_;
    if (req.body.email) email_ = req.body.email.toLowerCase().trim();
    let query = {
        email: email_
    };
    let user_exist = await common.getUser(query);
    if (user_exist.length) {
      if (email_ == user_exist?.[0]?.email) {
        await GlobalHelper.handleCustomError(
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
        );
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
    let save_data = {
      name: name ? name.trim() : null,
      country_code: country_code ? country_code.trim() : null,
      phone_no: phone_no ? phone_no.trim() : null,
      email: email_,
      password: _password,
      otp: otp,
      roles: "USER",
      created_at: +new Date(),
      // device_type:device_type
    };
    await EmailService.signUpOTpEmail(save_data);
    let data = await DAO.saveData(Models.Users, save_data);
    //send email
   
   
    let { _id , roles } = data;
    let token_generate = await common.generateUserToken(_id, roles, fcm_token);
    let response = await common.makeUserResponse(token_generate);
    return { message: `Signup successfully`, data: response };
  };

  static verifyEmail = async (req) => {
    try {
      let { _id: user_id } = req.user_data;
      let { email, otp: input_otp } = req.body;
      let options = { lean: true };

      // let query = { email: email.toLowerCase().trim() };
      console.log("user_id", user_id)
      let query = { _id: user_id };
      let get_user = await common.getUser(query);
      console.log("get_user----", get_user);
      
      if (get_user && get_user.length) {
        if (get_user[0].email_verified === true && get_user[0].otp == 0) {
          return { message: `Email verified successfully` };
        }
        let { otp } = get_user[0];
        console.log("input_otp----", input_otp);
        console.log("otp----", otp);

        if (Number(input_otp) == Number(otp)) {
          let update = { otp: 0, email_verified: true };
          await DAO.findAndUpdate(Models.Users, query, update, options);

          //send email
          await EmailService.welcomeEmail(get_user[0]);

          return { message: `Email verified successfully` };
        } else await GlobalHelper.handleCustomError(ERROR_MESSAGES.WRONG_OTP);
      } else
        await GlobalHelper.handleCustomError(
          ERROR_MESSAGES.EMAIL_NOT_REGISTERED
        );
    } catch (err) {
      throw err;
    }
  };

  static login = async (req) => {
    try {
      let { email, password: input_password, fcm_token } = req.body;
      //console.log("fcm_token===>",fcm_token)
      let query = { email: email.toLowerCase().trim() };
      let get_user = await common.getUser(query);

      if (get_user && get_user.length > 0) {
        let { _id, password, roles } = get_user[0];
        let descrypt_password = await GlobalHelper.decryptPassword(
          input_password,
          password
        );
        if (!descrypt_password)
          await GlobalHelper.handleCustomError(ERROR_MESSAGES.INVALID_PASSWORD);
        let token_generate = await common.generateUserToken(_id, roles, fcm_token);
        let response = await common.makeUserResponse(token_generate);
        return {
          message: `Login successfully`,
          data: response,
        };
      } else {
        await GlobalHelper.handleCustomError(
          ERROR_MESSAGES.EMAIL_NOT_REGISTERED
        );
      }
    } catch (err) {
      throw err;
    }
  };

  static getProfile = async (req) => {
    try {
      let { _id: user_id } = req.user_data;
      let options = { lean: true };
      let projection = { __v: 0, password: 0, otp:0, unique_code:0,socket_id:0 };
      let query = { _id: new Types.ObjectId(user_id) };
      let response = await DAO.getData(
        Models.Users,
        query,
        projection,
        options
      );
      return response[0];
    } catch (err) {
      throw err;
    }
  };

  static logout = async (req) => {
    try {
      let { _id: user_id } = req.user_data;
      let query = { user_id: user_id };
      await DAO.removeData(Models.Sessions, query);
      let response = { message: "Logout Successful" };
      return response;
    } catch (err) {
      throw err;
    }
  };
  

  static editProfile = async (req) => {
    try {
      let { _id: user_id } = req.user_data;

      let options = { new: true, projection: { __v: 0, password: 0 } };
      let query = { _id: user_id };
      let get_data;
      if (req.body.email) {
        get_data = await common.getUser({ email: req.body.email})
        if (get_data) {
          await GlobalHelper.handleCustomError(
            ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
          );
        }
      } else if (req.body.phone_no) {
        get_data = await common.getUser({ phone_no: req.body.phone_no });
        //console.log("get_data",get_data)
        if (get_data.length > 0) {
          await GlobalHelper.handleCustomError(
            ERROR_MESSAGES.PHONE_ALREADY_EXISTS
          );
        }
      } else {
        get_data = await DAO.getSingleData(
          Models.Users,
          query,
          projection,
          options
        );
      }

      let { name, email, country_code, phone_no } = req.body;

      let { email_verified } = get_data;

      let update = {
        ...((name || name == "") && {
          name: name.trim(),
        }),
        ...((email || email == "") && { email: email, email_verified: false }),
        ...((country_code || country_code == "") && {
          country_code: country_code,
        }),
        ...((phone_no || phone_no == "") && {
          phone_no: phone_no.trim(),
          phone_verified: false,
          phone_otp: phone_verified == false ? phone_otp : null,
        }),
      }
      options = { new: true, projection: { __v: 0, password: 0, otp:0, unique_code:0, socket_id:0} };
      let response = await DAO.findAndUpdate(
        Models.Users,
        query,
        update,
        options
      );

      if (email_verified == false)
        await EmailService.signUpOTpEmail(response);

      if (email_verified == false && email)
        await EmailService.signUpOTpEmail(response);
      //send email
      // if (email)
      //   await EmailService.signUpOTpEmail(response);
      return {
        message: `Profile edited successfully`,
        data: response,
      };
    } catch (err) {
      throw err;
    }
  };

  static resendEmailOtp = async (req) => {
    try {
      let { _id: user_id } = req.user_data;
      let options = { lean: true };
      let query = { _id: user_id };

      let get_user = await common.getUser(query);
      if (get_user && get_user.length > 0) {
        let otp = await GlobalHelper.generateOtp();
        let update = {
          otp: otp,
          email_verified: false,
        };
        await DAO.findAndUpdate(Models.Users, query, update, options);
        let response = await DAO.getSingleData(
          Models.Users,
          query,
          { __v: 0 },
          { lean: true }
        );
        //console.log("RESPO ", response);
        //send email
        await EmailService.ResendOTPEmail(response);
        return { message: `OTP sent successfully` };
      }
    } catch (err) {
      throw err;
    }
  };

  static changePassword = async (req) => {
    try {
      let { _id: user_id } = req.user_data;
      //console.log("req session_data", req.session_data);

      let { access_token } = req.session_data;

      let options = { new: true, projection: { __v: 0, password: 0 } };

      let { old_password, new_password } = req.body;

      let query = { _id: user_id };
      let get_user = await common.getUser(query);
      if (get_user && get_user.length > 0) {
        let { password } = get_user[0];

        let decrypt_old = await GlobalHelper.decryptPassword(
          old_password,
          password
        );
        if (!decrypt_old)
          await GlobalHelper.handleCustomError(
            ERROR_MESSAGES.OLD_PASSWORD_MISMATCH
          );

        let bcrypt_password = await GlobalHelper.bcryptPassword(new_password);

        let update = {
          ...(bcrypt_password && { password: bcrypt_password }),
        };
        await DAO.findAndUpdate(Models.Users, query, update, options);

        //remove-other-sessions
        let session_query = {
          access_token: { $ne: access_token },
          user_id: new Types.ObjectId(user_id),
        };
        await DAO.removeMany(Models.Sessions, session_query);

        return { message: "Password changed successfully" };
      }
    } catch (err) {
      throw err;
    }
  };

  static forgotPassword = async (req) => {
    try {
      let { email } = req.body;
      let options = { lean: true };

      let query = { email: email.toLowerCase().trim() };
      let get_user = await common.getUser(query);

      if (get_user && get_user.length > 0) {
        let otp = await GlobalHelper.generateOtp();
        let unique_code = await GlobalHelper.generateUniqueCode();

        let update = {
          fp_otp: otp,
          unique_code: unique_code,
          fp_otp_verified: false,
        };
        await DAO.findAndUpdate(Models.Users, query, update, options);

        let data = await DAO.getSingleData(
          Models.Users,
          query,
          { __v: 0 },
          options
        );
        await EmailService.ResetPasswordEmail(data);

        return { message: "OTP sent successfully", unique_code: unique_code };
      } else {
        await GlobalHelper.handleCustomError(
          ERROR_MESSAGES.EMAIL_NOT_REGISTERED
        );
      }
    } catch (err) {
      throw err;
    }
  };

  static forgotPasswordVerifyOtp = async (req) => {
    try {
      let { unique_code, otp } = req.body;
      let options = { lean: true };

      let query = { unique_code: unique_code.trim() };
      let get_user = await common.getUser(query);

      if (get_user && get_user.length > 0) {
        let { fp_otp } = get_user[0];

        if (Number(otp) != Number(fp_otp)) {
          await GlobalHelper.handleCustomError(ERROR_MESSAGES.WRONG_OTP);
        } else {
          let new_unique_code = await GlobalHelper.generateUniqueCode();
          let update = {
            fp_otp: null,
            unique_code: new_unique_code,
            fp_otp_verified: true,
          };
          await DAO.findAndUpdate(Models.Users, query, update, options);
          return {
            message: "OTP verified successfully",
            unique_code: new_unique_code,
          };
        }
      } else {
        await GlobalHelper.handleCustomError(
          ERROR_MESSAGES.SOMETHING_WENT_WRONG
        );
      }
    } catch (err) {
      throw err;
    }
  };

  static resetPassword = async (req) => {
    try {
      let options = { new: true, projection: { __v: 0, password: 0 } };

      let { unique_code, new_password } = req.body;

      let query = { unique_code: unique_code };
      let get_user = await common.getUser(query);

      if (get_user && get_user.length > 0) {
        let { fp_otp_verified } = get_user[0];

        if (fp_otp_verified == true || fp_otp_verified == "true") {
          let bcrypt_password = await GlobalHelper.bcryptPassword(new_password);
          let update = {
            ...(bcrypt_password && { password: bcrypt_password }),
            unique_code: null,
            fp_otp_verified: false,
          };
          await DAO.findAndUpdate(Models.Users, query, update, options);

          return { message: "Password changed successfully" };
        }
      } else
        await GlobalHelper.handleCustomError(
          ERROR_MESSAGES.SOMETHING_WENT_WRONG
        );
    } catch (err) {
      throw err;
    }
  };

  static getOtherUser = async (req) => {
    try {
      let { pagination, limit, search } = req.query;
      let user = req.user_data;
      let user_query = { roles:"USER"};
      if (user.roles == "MANAGER") {
        let query = { manager: new Types.ObjectId(user_id) };
        let projection = { members: 1 };
        let options = { lean: true };
        const teams = await DAO.getData(
          Models.Tasks,
          query,
          projection,
          options
        );

        const members = teams.reduce((acc, team) => {
          acc.push(...team.members);
          return acc;
        }, []);
        user_query = { $in: [new Types.ObjectId(members)] };
      }
      if (search) {
        user_query.$or = [{ name: { $regex: search, options: "i" } }];
      }
      let projection = { __v: 0, password: 0, otp:0, unique_code:0, socket_id:0}
      let options = await GlobalHelper.setOptions(
        Number(pagination),
        Number(limit)
      );
      let data = await DAO.getData(
        Models.Users,
        user_query,
        projection,
        options
      );
      let count = await DAO.countDocument(Models.Users, query);
      return {
        data,
        count,
      };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserService;
