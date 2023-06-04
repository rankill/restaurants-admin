const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../utils/error");
const User = require("./user.model");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.method({
  jsonObject() {
    const object = {};
    const fields = ["id", "name", "description", "location", "owner"];

    fields.forEach((field) => {
      object[field] = this[field];
    });

    if (this.owner instanceof User) {
      object["owner"] = {
        id: this.owner._id,
        name: this.owner.name,
      };
    }

    return object;
  },
});


restaurantSchema.statics = {
  async get(id) {
    let match = { id: mongoose.Types.ObjectId(id) };

    try {
      let pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "restaurant",
            as: "reviews",
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            description: 1,
            location: 1,
            createdAt: 1,
            "owner.id": "$owner._id",
            "owner.name": 1,
            rating: { $avg: "$reviews.rating" },
            reviewCount: { $size: "$reviews" },
          },
        },
        {
          $match: match,
        },
        { $limit: 1 },
      ];

      let restaurants = await this.aggregate(pipeline);
      if (restaurants.length == 0) {
        return null;
      } else {
        return restaurants[0];
      }
    } catch (error) {
      throw error;
    }
  },

  async list({
    page = 1,
    perPage = 10,
    query,
    ownerId,
    rating,
    sortByRating = false,
  }) {
    page = parseInt(page);
    perPage = parseInt(perPage);

    let match = {},
      sort = { createdAt: 1 };

    if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
      match["owner.id"] = mongoose.Types.ObjectId(ownerId);
    }

    if (query) {
      match["$or"] = [
        { name: RegExp(query, "i") },
        { description: RegExp(query, "i") },
        { location: RegExp(query, "i") },
      ];
    }

    if (rating && parseInt(rating) > 0) {
      rating = parseInt(rating);
      match["rating"] = { $gte: rating, $lt: rating + 1 };
    }

    if (sortByRating) {
      sort = { rating: -1, createdAt: 1 }
    }

    try {
      let aggregate = [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "restaurant",
            as: "reviews",
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            description: 1,
            location: 1,
            createdAt: 1,
            "owner.id": "$owner._id",
            "owner.name": 1,
            reviewCount: { $size: "$reviews" },
            rating: { $avg: "$reviews.rating" },
          },
        },
        { $match: match },
        { $sort: sort },
        { $skip: perPage * (page - 1) },
      ];

      if (perPage > 0) {
        aggregate.push({ $limit: parseInt(perPage) });
      }
      let restaurants = await this.aggregate(aggregate);

      if (match["owner.id"]) {
        match["owner"] = match["owner.id"];
        delete match["owner.id"];
      }
      let total = await this.countDocuments(match).exec();
      return { restaurants, total, page, perPage };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("Restaurant", restaurantSchema);
