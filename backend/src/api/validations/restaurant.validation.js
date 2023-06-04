const Joi = require("joi");

module.exports = {
  createRestaurant: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
    }).options({ allowUnknown: true }),
  },

  updateRestaurant: {
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      location: Joi.string(),
    }).options({ allowUnknown: true }),
  },
};
