const Models = require("../../models");
const DAO = require("../../DAO/query");
const { ERROR_MESSAGES } = require("../../config/error");
const GlobalHelper  = require( "../../helper/helper");
const accessTokenHelper = require('../../middlewares/token_helpers')
 class common {
    static getUser = async (query) => {
      let options = { lean: true };
      let projection = { __v: 0 };
      let get_data = await DAO.getData(
        Models.Users,
        query,
        projection,
        options
      );
      return get_data;
    };
  
    static generateUserToken = async (_id, roles, fcm_token) => {
      let token_data = {
        _id: _id,
        roles,
        token_gen_at: +new Date(),
      };
      let access_token = await accessTokenHelper.generateToken(token_data);
      let response = await this.saveSessionData(
        token_data, fcm_token, access_token
      );
      return response;
    };
    
  
    static saveSessionData = async (
      token_data,fcm_token, access_token
    ) => {
      try {
        let { _id: user_id, token_gen_at , roles} = token_data;
        let set_data = {
          type: roles,
          user_id: user_id,
          access_token: access_token,
          token_gen_at: token_gen_at,
          fcm_token: fcm_token || null,
          created_at: +new Date()
        };
        let response = await DAO.saveData(
          Models.Sessions,
          set_data
        );
        return response;
      } catch (err) {
        throw err;
      }
    };
  
    static makeUserResponse = async (data) => {
      try {  
        let { user_id, access_token, token_gen_at } = data;
        let query = { _id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = await DAO.getData(
          Models.Users,
          query,
          projection,
          options
        );
        if (fetch_data.length) {
          let set_data = { updated_at: +new Date() };
          let options = {
            projection: {
              _id:1,
              first_name:1,
              last_name:1,
              email:1,
              country_code:1,
              phone_no:1,
              password: 0,
              email_verified:1,
              created_at: 1,
              __v: 0,
            },
            new: true,
          };
          let update = await DAO.findAndUpdate(
            Models.Users,
            query,
            set_data,
            options
          );
          update._doc["token_gen_at"] = token_gen_at;
          update._doc["access_token"] = access_token;
          //console.log("update  ===", update);
          
          return update;
        } else {
          await GlobalHelper.handleCustomError(ERROR_MESSAGES.UNAUTHORIZED);
        }
      } catch (err) {
        throw err;
      }
    };
  
    static verifyToken = async () => {
      try {
      } catch (err) {
        throw err;
      }
    };
}
  
module.exports = common;