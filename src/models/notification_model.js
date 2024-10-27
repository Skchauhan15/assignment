const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Notification_schema = new mongoose.Schema({
  sent_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
  sent_to: { type: Schema.Types.ObjectId, ref:"users", default: null},
  message: { type: String, default: null },
  title: { type: String, default: null },
  type: { type: String, default: null },
  is_read:{ type: Boolean, default: false },
  created_at: { type: Date, default: +new Date() },
});

const Notifications =  mongoose.model("notifications", Notification_schema);
module.exports = Notifications;
