const httpStatus = require("http-status");
const Restaurant = require("../models/restaurant.model");
const Review = require("../models/review.model");

const { Role } = require("../../config/config");
const APIError = require("../utils/error");

exports.load = async (req, res, next, id) => {
  try {
    const restaurant = await Restaurant.findById(id).populate("owner").exec();

    if (!restaurant) {
      throw new APIError({
        message: "Restaurant does not exist",
        status: httpStatus.NOT_FOUND,
      });
    }

    req.locals = { restaurant };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.get(req.locals.restaurant._id);
    
    let highestReview = await Review.findOne({ restaurant: restaurant._id }).sort({ rating: -1 }).exec();
    let lowestReview = await Review.findOne({ restaurant: restaurant._id }).sort({ rating: 1 }).exec();
    if (highestReview && lowestReview) {
      restaurant.highestReview = highestReview.jsonObject();
      restaurant.lowestReview = lowestReview.jsonObject();
    }

    const myReview = await Review.findOne({restaurant: req.locals.restaurant._id, user: req.user._id});
    if (myReview) {
      restaurant.reviewed = true;
    } else {
      restaurant.reviewed = false;
    }

    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const restaurant = new Restaurant(req.body);
    restaurant.owner = req.user;
    const savedRestaurant = await restaurant.save();
    res.status(httpStatus.CREATED);
    res.json(savedRestaurant.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.update = (req, res, next) => {
  const restaurantData = req.body;
  if (req.user.role !== Role.Admin && !req.locals.restaurant.owner.equals(req.user.id)) {
    const error = new APIError({
      message: "You don't have permission.",
      status: httpStatus.FORBIDDEN,
    });
    return next(error);
  }

  const restaurant = Object.assign(req.locals.restaurant, restaurantData);
  restaurant
    .save()
    .then((savedRestaurant) => res.json(savedRestaurant.jsonObject()))
    .catch((e) => next(e));
};

exports.list = async (req, res, next) => {
  try {
    const { user } = req;
    let query = req.query;
    
    if (user.role === Role.Owner) {
      query["ownerId"] = user._id;
    }
    if (user.role === Role.Regular) {
      query["sortByRating"] = true;
    }

    let restaurants = await Restaurant.list({ ...req.query });
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { restaurant } = req.locals;

  if (req.user.role !== Role.Admin && !req.locals.restaurant.owner.equals(req.user._id)) {
    const error = new APIError({
      message: "You don't have permission.",
      status: httpStatus.FORBIDDEN,
    });
    return next(error);
  }

  try {
    await Review.deleteMany({ restaurant: restaurant._id });
    await restaurant.remove();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (e) {
    next(e);
  }
};
