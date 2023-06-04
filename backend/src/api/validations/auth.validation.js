const Joi = require("joi");

module.exports = {
  register: {
    body: Joi.object({
      name: Joi.string().required(),
      role: Joi.string().required().valid('owner', 'regular'),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },

  refresh: {
    body: Joi.object({
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    }),
  },
};
