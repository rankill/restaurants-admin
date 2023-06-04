const httpStatus = require("http-status");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const moment = require("moment-timezone");
const { jwtExpiration } = require("../../config/config");
const APIError = require("../utils/error");

function tokenResponse(user, accessToken) {
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpiration, "minutes");
  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

exports.register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email }).exec();
    if (existing) {
      const error = new APIError({
        message: "Email already exists",
        status: httpStatus.BAD_REQUEST
      });
      throw error;
    }

    const user = await new User(req.body).save();
    const userObject = user.jsonObject();
    const token = tokenResponse(user, user.jwtToken());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userObject });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email }).exec();
    const error = new APIError({
      message: "Incorrect email or password",
      status: httpStatus.UNAUTHORIZED
    });

    if (!user) {
      throw error;
    }

    if (!await user.comparePassword(req.body.password)) {
      throw error;
    }

    const token = tokenResponse(user, user.jwtToken());
    const userObject = user.jsonObject();
    return res.json({ token, user: userObject });
  } catch (error) {
    return next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;

    const error = new APIError({
      message: "Incorrect email or refreshToken",
      status: httpStatus.UNAUTHORIZED
    });

    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });

    if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        throw error;
      } else {
        const token = tokenResponse(user, user.jwtToken());
        return res.json(token);
      }
    } else {
      throw error;
    }
  } catch (error) {
    return next(error);
  }
};
