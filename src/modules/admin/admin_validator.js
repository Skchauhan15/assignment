const Joi = require("joi");
const GlobalHelper = require("../../helper/helper");

const validateCreateManager = async (req, res, next) => {
  try {
    let schema = Joi.object({
      name: Joi.string().required().max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required().regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).min(4).messages({
        'string.pattern.base': 'Password must contain at least one digit and be at least 4 characters long.',
        'string.empty': 'Password is required.',
        'string.min': 'Password should be at least 4 characters long.',
    }),
      country_code: Joi.string().max(5),
      phone_no: Joi.string().regex(/^[0-9]{10}$/).messages({
        "string.min": "NUmber is to be 10 digit in length",
        "string.max": "NUmber is to be 10 digit in length",
        "string.pattern.base":"Only number allowed"
      }),
      fcm_token: Joi.string().optional(),
    });

    let { error } = schema.validate(req.body);
    if (error) {
      await GlobalHelper.handleJoiError(error);
    } else {
      next();
    }
  } catch (err) {
    GlobalHelper.handleCatch(res, err);
  }
};
  
  const validateMember = async (
    req,
    res,
    next
  ) => {
    try {
      let schema =  Joi.object({
        user_id: Joi.string()
          .required()
          .description('Enter user_id')
      });
  
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else next();
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  const validateCreateTeam = async (
    req,
    res,
    next
  ) => {
    try {
      let schema = Joi.object({
        name: Joi.string()
          .required()
          .description('Enter title'),
        description: Joi.string()
          .required()
          .description('Enter description'),
        manager: Joi.string()
          .required()
          .description('manager_id(user_id)')
      });
  
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else next();
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };

module.exports = {
    validateCreateManager,
    validateCreateTeam,
    validateMember
};
