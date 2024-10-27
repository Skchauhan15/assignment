const Joi = require("joi");
const GlobalHelper = require("../../helper/helper");

const validateCreateTask = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required().description("Enter title"),
      description: Joi.string().required(),
      due_date: Joi.number().required(),
      priority: Joi.string()
        .valid("high", "low")
        .required()
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

const validateEditTask = async (req, res, next) => {
  try {
    const editTaskSchema = Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      due_date: Joi.string().optional(),
      priority: Joi.string().valid("high", "low").optional()
    });
    
    let { error } = editTaskSchema.validate(req.body);
    if (error) {
      await GlobalHelper.handleJoiError(error);
    } else {
      next();
    }
  } catch (err) {
    GlobalHelper.handleCatch(res, err);
  }
};

const validateAssignTask = async (req, res, next) => {
  try {
    const Schema = Joi.object({
      assign_to: Joi.string().required(),
    });
    
    let { error } = Schema.validate(req.body);
    if (error) {
      await GlobalHelper.handleJoiError(error);
    } else {
      next();
    }
  } catch (err) {
    GlobalHelper.handleCatch(res, err);
  }
};

const validateStatusUpdate = async (req, res, next) => {
  try {
    const Schema = Joi.object({
      status: Joi.string().valid("pending", "progress","complete").optional()
    });
    
    let { error } = Schema.validate(req.body);
    if (error) {
      await GlobalHelper.handleJoiError(error);
    } else {
      next();
    }
  } catch (err) {
    GlobalHelper.handleCatch(res, err);
  }
};

  
module.exports = {
  validateCreateTask,
  validateEditTask,
  validateAssignTask,
  validateStatusUpdate,
};



