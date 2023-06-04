const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/restaurant.controller");
const reviewController = require("../../controllers/review.controller");
const { authorize } = require("../../middlewares/authorize");
const { Role } = require("../../../config/config");
const router = express.Router();
const {
  createRestaurant,
  updateRestaurant,
} = require("../../validations/restaurant.validation");
const { createReview } = require("../../validations/review.validation");

router.param("restaurantId", controller.load);

router
  .route("/")
  .get(authorize(), controller.list)
  .post(authorize(Role.Owner), validate(createRestaurant), controller.create);

router
  .route("/:restaurantId")
  .get(authorize(), controller.get)
  .patch(authorize(Role.Owner, Role.Admin), validate(updateRestaurant), controller.update)
  .delete(authorize(Role.Owner, Role.Admin), controller.remove);

router
  .route("/:restaurantId/reviews")
  .get(authorize(), reviewController.list)
  .post(authorize(Role.Regular), validate(createReview), reviewController.create);


module.exports = router;
