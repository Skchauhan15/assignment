const mongoose = require("mongoose");
const moment = require('moment')
var Schema = mongoose.Schema;

const team_schema = new mongoose.Schema({
  name: { type: String, default: null },
  description: { type: String, default: null  },
  manager: { type: Schema.Types.ObjectId, ref: "users", default: null },//conserding a single manager of a team
  members: [{ type:Schema.Types.ObjectId, ref:"users", default: null }],
  created_at: { type: Number, default: moment().utc().valueOf()}
});

const Teams =  mongoose.model("teams", team_schema);
module.exports= Teams;
