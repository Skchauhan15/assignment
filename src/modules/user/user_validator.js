const Joi = require("joi");
const GlobalHelper = require("../../helper/helper");

const validateSignUp = async (req, res, next) => {
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

const validateLogin = async (
    req,
    res,
    next,
  ) => {
    try {
      let schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        fcm_token: Joi.string().optional(),
      });
      //console.log("req.body ", req.body);
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else {
        //console.log("next ");
        next();
      }
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  const validateOtp = async (req, res, next) => {
    try {
      let schema = Joi.object({
        otp: Joi.number().required(),
      });
  
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else next();
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  const validateEditProfile = async (
    req,
    res,
    next
  ) => {
    try {
      let schema = Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        image: Joi.string().optional(),
        country_code: Joi.string().max(5),
        phone_no: Joi.string().regex(/^[0-9]{10}$/).messages({
          "string.min": "NUmber is to be 10 digit in length",
          "string.max": "NUmber is to be 10 digit in length",
          "string.pattern.base":"Only number allowed"
        }).optional(),
        about: Joi.string().optional(),
      });
  
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else next();
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
};
  
const validateChangePassword = async (
    req,
    res,
    next
  ) => {
    try {
      let schema = Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().required().regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).min(4).messages({
          'string.pattern.base': 'Password must contain at least one digit and be at least 4 characters long.',
          'string.empty': 'Password is required.',
          'string.min': 'Password should be at least 4 characters long.',
      }),
      });
  
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else next();
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  const validateForgotPassword = async (
    req,
    res,
    next
  ) => {
    try {
      let schema= Joi.object({
        email: Joi.string().email().required(),
      });
  
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else next();
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  const validateResetPassword = async (
    req,
    res,
    next
  ) => {
    try {
      let schema = Joi.object({
        unique_code: Joi.string().required(),
        new_password: Joi.string().required().regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).min(4).messages({
          'string.pattern.base': 'Password must contain at least one digit and be at least 4 characters long.',
          'string.empty': 'Password is required.',
          'string.min': 'Password should be at least 4 characters long.',
      }),
      });
  
      let { error } = schema.validate(req.body);
      if (error) {
        await GlobalHelper.handleJoiError(error);
      } else next();
    } catch (err) {
      GlobalHelper.handleCatch(res, err);
    }
  };
  
  const validateForgotPassVerify = async (
    req,
    res,
    next
  ) => {
    try {
      let schema = Joi.object({
        unique_code: Joi.string().required(),
        otp: Joi.string().required(),
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
    validateSignUp,
    validateLogin,
    validateOtp,
    validateEditProfile,
    validateChangePassword,
    validateForgotPassword,
    validateForgotPassVerify,
    validateResetPassword,
};
