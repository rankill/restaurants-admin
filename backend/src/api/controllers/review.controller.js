const httpStatus = require('http-status');
const Review = require('../models/review.model');
const APIError = require('../utils/error');

exports.load = async (req, res, next, id) => {
  try {
    const review = await Review.findById(id).populate("restaurant").populate("user").exec();

    if (!review) {
      throw new APIError({
        message: "Review does not exist",
        status: httpStatus.NOT_FOUND,
      });
    }

    req.locals = { review };
    return next();
  } catch (error) {
    return next(error);
  }
};


exports.get = (req, res) => res.json(req.locals.review.jsonObject());

exports.create = async (req, res, next) => {
  try {
    const user = req.user, restaurant = req.locals.restaurant;
    const existingReview = await Review.findOne({ user: user._id, restaurant: restaurant._id });

    if (existingReview) {
      const error = new APIError({
        message: "You already left review to this restaurant.",
        status: httpStatus.FORBIDDEN
      });
      throw error;
    }

    const review = new Review(req.body);
    review.user = req.user;
    review.restaurant = req.locals.restaurant;
    const savedReview = await review.save();
    res.status(httpStatus.CREATED);
    res.json(savedReview.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.update = (req, res, next) => {
  const reviewData = req.body;
  const review = Object.assign(req.locals.review, reviewData);
  review.save()
    .then(savedReview => res.json(savedReview.jsonObject()))
    .catch(e => next(e));
};

exports.list = async (req, res, next) => {
  try {
    const { restaurant } = req.locals;
    let reviews = await Review.list({ ...req.query, restaurantId: restaurant._id });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.listPending = async (req, res, next) => {
  try {
    const { user } = req;
    let reviews = await Review.list({ ...req.query, ownerId: user._id, noreply: true });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { review } = req.locals;
  try {
    await review.remove();
    res.status(httpStatus.NO_CONTENT).end()
  } catch (e) {
    next(e);
  }
};
