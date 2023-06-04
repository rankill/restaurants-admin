const mongoose = require("mongoose");
const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const APIError = require("../utils/error");
const { jwtSecret, jwtExpiration } = require("../../config/config");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "owner", "regular"],
      default: "regular",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hash = await bcrypt.hash(this.password, 1);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.method({
  jsonObject() {
    const object = {};
    const fields = ["id", "name", "email", "role", "createdAt"];

    fields.forEach((field) => {
      object[field] = this[field];
    });

    return object;
  },

  // Generate JWT Token from user id
  jwtToken() {
    const playload = {
      exp: moment().add(jwtExpiration, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },

  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

userSchema.statics = {
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email)
      throw new APIError({
        message: "An email is required to generate a token",
      });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = "Incorrect email or password";
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = "Invalid refresh token.";
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = "Incorrect email or refreshToken";
    }
    throw new APIError(err);
  },

  async list({ page = 1, perPage = 10, search }) {
    let match = {};
    page = parseInt(page);
    perPage = parseInt(perPage);

    if (search) {
      match["$or"] = [
        { name: RegExp(search, "i") },
        { email: RegExp(search, "i") },
        { role: RegExp(search, "i") },
      ];
    }

    try {
      let pipeline = [
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            email: 1,
            role: 1,
            createdAt: 1,
          },
        },
        {
          $match: match,
        },
        { $sort: { createdAt: 1 } },
        { $skip: perPage * (page - 1) },
      ];

      if (perPage > 0) {
        pipeline.push({ $limit: parseInt(perPage) });
      }

      let users = await this.aggregate(pipeline);
      let total = await this.countDocuments(match).exec();

      return { users, total, page, perPage };
    } catch (error) {
      throw error;
    }
  },

};

module.exports = mongoose.model("User", userSchema);
