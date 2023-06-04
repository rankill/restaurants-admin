const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const APIError = require("../utils/error");
const User = require("./user.model");
const Restaurant = require("./restaurant.model");

const reviewSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurant",
    },

    rating: {
      type: Number,
      required: true,
    },

    visitDate: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },

    reply: {
      text: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.method({
  jsonObject() {
    const object = {};
    const fields = [
      "id",
      "rating",
      "visitDate",
      "comment",
      "reply",
      "user",
      "restaurant",
      "createdAt",
    ];

    fields.forEach((field) => {
      object[field] = this[field];
    });

    if (this.user instanceof User) {
      object["user"] = {
        id: this.user._id,
        name: this.user.name
      };
    }

    if (this.restaurant instanceof Restaurant) {
      object["restaurant"] = {
        id: this.restaurant._id,
        name: this.restaurant.name
      }
    }

    return object;
  }
});

reviewSchema.statics = {
  async list({
    page = 1,
    perPage = 10,
    rating,
    restaurantId,
    ownerId,
    noreply = false,
  }) {
    let match = {};
    if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
      match["restaurant.owner"] = mongoose.Types.ObjectId(ownerId);
    }

    if (restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
      match["restaurant.id"] = mongoose.Types.ObjectId(restaurantId);
    }

    if (rating && parseInt(rating) > 0) {
      match["rating"] = parseInt(rating);
    }

    if (noreply === true || noreply === "true") {
      match["reply"] = { $exists: false };
    }
    page = parseInt(page);
    perPage = parseInt(perPage);
    try {
      let pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        { $unwind: "$restaurant" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            rating: 1,
            visitDate: 1,
            comment: 1,
            reply: 1,
            createdAt: 1,
            "user.id": "$user._id",
            "user.name": 1,
            "restaurant.id": "$restaurant._id",
            "restaurant.name": 1,
            "restaurant.owner": 1,
          },
        },
        {
          $match: match,
        },
        { $sort: { createdAt: -1 } },
        { $skip: perPage * (page - 1) },
      ];

      if (perPage > 0) {
        pipeline.push({ $limit: parseInt(perPage) });
      }
      let reviews = await this.aggregate(pipeline);

      pipeline = [
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        { $unwind: "$restaurant" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            rating: 1,
            visitDate: 1,
            comment: 1,
            reply: 1,
            createdAt: 1,
            "restaurant.id": "$restaurant._id",
            "restaurant.name": 1,
            "restaurant.owner": 1,
          },
        },
        {
          $match: match,
        },
        {
          $count: "count",
        },
      ];
      let count = await this.aggregate(pipeline);
      let total = 0;
      if (count && count.length > 0) {
        total = count[0].count;
      }

      return { reviews, total, page, perPage };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("Review", reviewSchema);
