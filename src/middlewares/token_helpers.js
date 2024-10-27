const jwt = require("jsonwebtoken");
const ERROR_MESSAGES  = require("../config/error");
const GlobalHelper = require("../helper/helper");
const DAO = require("../DAO/query")
class token_helper {
  static generateToken = async (token_data) => {
    return new Promise((resolve, reject) => {
      try {
        let secret_key = "assignment"
        const token = jwt.sign(token_data, secret_key);
        return resolve(token);
      } catch (err) {
        throw reject(err);
      }
    });
  }

  static decodeToken = (token, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        let set_secret_key = "assignment"
        jwt.verify(token, set_secret_key, (err, decoded) => {
          if (decoded == undefined) {
            return reject("UNAUTHORIZED");
          } else {
            return resolve(decoded);
          }
        });
      } catch (err) {
        throw err;
      }
    });
  };

  static verifyToken = async (token) => {
    try {
      let projection = { __v: 0 };
      let options = { lean: true };
      let decoded = await this.decodeToken(token);
      let  query = {
          user_id: decoded._id,
          token_gen_at: decoded.token_gen_at,
      };
      let fetch_data = await DAO.getData(
        Models.Session,
        query,
        projection,
        options
      );
        return fetch_data[0];
    } catch (err) {
      throw err
    }
  };
}

module.exports = token_helper