const httpStatus = require('http-status');
const APIError = require('../utils/error');

exports.create = async (req, res, next) => {
  try {
    const user = req.user, review = req.locals.review;
    
    if (!review.restaurant.owner.equals(user._id)) {
      const error = new APIError({
        message: "You are not the owner of the restaurant.",
        status: httpStatus.FORBIDDEN
      });
      throw error;
    }
    if (review.reply && review.reply.text) {
      const error = new APIError({
        message: "You already replied to this review.",
        status: httpStatus.FORBIDDEN
      });
      throw error;
    }

    review.reply = {
      text: req.body.reply,
      createdAt: new Date()
    };

    const savedReview = await review.save();
    res.json(savedReview.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const review = req.locals.review;

    if (!review.reply) {
      const error = new APIError({
        message: "There's no reply to this review.",
        status: httpStatus.FORBIDDEN
      });
      throw error;
    }

    review.reply.text = req.body.reply;

    const savedReview = await review.save();
    res.json(savedReview.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { review } = req.locals;
  try {
    review.reply = undefined;
    const savedReview = await review.save();
    res.json(savedReview.jsonObject());
  } catch (e) {
    next(e);
  }
};
