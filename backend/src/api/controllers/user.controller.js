const httpStatus = require("http-status");
const { omit } = require("lodash");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Review = require("../models/review.model");
const { Role } = require("../../config/config");
const APIError = require("../utils/error");

exports.load = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new APIError({
        message: "User does not exist",
        status: httpStatus.NOT_FOUND,
      });
    }

    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.user.jsonObject());

exports.create = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email }).exec();
    if (existing) {
      throw new APIError({
        message: "Email already exists",
        status: httpStatus.BAD_REQUEST,
      });
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.email !== req.locals.user.email) {
      const existing = await User.findOne({ email: req.body.email }).exec();
      if (existing) {
        throw new APIError({
          message: "Email already exists",
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    const user = Object.assign(req.locals.user, req.body);

    const savedUser = await user.save();
    res.json(savedUser.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let users = await User.list(req.query);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.listForRestaurant = async (req, res, next) => {
  try {
    let { restaurant } = req.locals;
    if (!restaurant.owner.equals(req.user._id)) {
      const error = new APIError({
        message: "You don't have permission.",
        status: httpStatus.FORBIDDEN,
      });
      throw error;
    }
    let users = await User.listForRestaurant({
      ...req.query,
      restaurantId: restaurant.id,
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { user } = req.locals;

  try {
    const restaurants = await Restaurant.find({ owner: user._id });
    for (let restaurant of restaurants) {
      await Review.deleteMany({ restaurant: restaurant._id });
    }
    await Restaurant.deleteMany({ owner: user._id });
    await Review.deleteMany({ user: user._id });
    await user.remove();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};


exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.email !== req.user.email) {
      const existing = await User.findOne({ email: req.body.email }).exec();
      if (existing) {
        throw new APIError({
          message: "Email already exists",
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    const user = Object.assign(req.user, req.body);

    const savedUser = await user.save();
    res.json(savedUser.jsonObject());
  } catch (error) {
    next(error);
  }
};