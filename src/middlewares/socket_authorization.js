const verifyToken = require("./authJwt");
const DAO = require('../query/query')
const Models = require('../models')
const socket_authenticator = async (socket, next) => {
  try {
    let token = socket.handshake.headers.token;
    let fetch_token_data = await verifyToken(token);
    if (fetch_token_data) {
     let { user_id,email }= fetch_token_data
    let query = { _id: user_id}
    let projection= { __v:0 }
    let options = { lean: true }
    let fetch_data = await DAO.getData(Models.Users ,query, projection, options)
    if(fetch_data.length){
        socket.user_data= fetch_data[0]
        next();
    }
    else{
         socket.emit("unauthorised", {
           type: "Error",
           error: "you are not authorized to perform this action",
         });
    }
    }
  } catch (error) {
       console.log("socket_authenticator err")
       throw error;
  }
};
module.exports = socket_authenticator;
