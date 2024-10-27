const Joi = require("joi");
const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.number().min(10).max(10),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .default(null),
  password: Joi.string(),
});

module.exports=userSchema;

