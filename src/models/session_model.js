const { ref, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user_role = ["ADMIN", "USER", "MANAGER"];
const sessionSchema = mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users", default: null },
  type: { type: String, enum: user_role, default: 'USER' },
  access_token :{ type:String, default: null },
  token_gen_at: { type: Number }, /// it could be a Date too
  fcm_token: { type: String, default: null },
  device_type: { type:String, default:"WEB"}
});

const Sessions = mongoose.model("sessions", sessionSchema);
module.exports = Sessions;
