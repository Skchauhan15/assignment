const { config } = require("dotenv");
const mongoose = require("mongoose");
config();


const connect_to_monogoose=()=>{
  mongoose
  .connect(process.env.MONGODB)
  .then((err) => {})
  .catch((err) => {
    console.log(err);
  });
  console.log("db_connected")
}

 module.exports= connect_to_monogoose;