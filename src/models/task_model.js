const mongoose = require("mongoose");
const moment = require('moment')
var Schema = mongoose.Schema;

const task_priority = ["high","normal", "low"];
const task_status = ["pending","progress", "complete"]

const task_schema = new mongoose.Schema({
  title: { type: String, default: null },
  description: { type: String, default: null  },
  due_date : { type: Number },
  priority :{ type: String , default :"normal", enum: task_priority },
  status: { type: String, default: "pending", enum: task_status },
  assign_by: { type:Schema.Types.ObjectId, ref:"users", default: null },
  assign_to: { type: Schema.Types.ObjectId, ref: "users", default: null },
  created_at: { type: Number, default: moment().utc().valueOf()}
});

const Tasks =  mongoose.model("tasks", task_schema);
module.exports= Tasks;
