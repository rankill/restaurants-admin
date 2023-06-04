const Joi = require("joi");
const User = require("../models/user.model");
const { Role } = require("../../config/config");

module.exports = {
  createUser: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(Role.Admin, Role.Owner, Role.Regular),
    }).options({ allowUnknown: true }),
  },

  updateUser: {
    body: Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
      name: Joi.string().max(128),
      role: Joi.string().valid(Role.Admin, Role.Owner, Role.Regular),
    }).options({ allowUnknown: true }),
  },
};
