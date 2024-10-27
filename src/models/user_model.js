const { string, date, array } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require('moment')
const user_role = ["ADMIN", "USER", "MANAGER"];
const person = mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, default: null, unique: true },
  password: { type: String, default: null },
  country_code: { type: String, default: null },
  phone_no: { type: String, default: null },
  otp: { type: String, default: null },
  unique_code: { type: String, default: null },
  email_verified: { type: Boolean, default: false },
  roles: { type: String, enum: user_role, default: "user" },
  created_at: { type: Number, default: moment().utc().valueOf() },
  updated_at: { type: Number, default: moment().utc().valueOf() },
  socket_id: { type: String, default: null }
});
const Persons =  mongoose.model("users", person);

module.exports = Persons;
