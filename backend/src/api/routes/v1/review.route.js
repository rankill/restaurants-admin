const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/review.controller");
const replyController = require("../../controllers/reply.controller");
const { authorize } = require("../../middlewares/authorize");
const { Role } = require("../../../config/config");
const router = express.Router();
const { updateReview } = require("../../validations/review.validation");

router.param("reviewId", controller.load);

router.route("/pending").get(authorize(Role.Owner, Role.Admin), controller.listPending);

router
  .route("/:reviewId")
  .get(authorize(Role.Admin), controller.get)
  .patch(authorize(Role.Admin), validate(updateReview), controller.update)
  .delete(authorize(Role.Admin), controller.remove);

router
  .route("/:reviewId/reply")
  .post(authorize(Role.Owner), replyController.create)
  .patch(authorize(Role.Admin), replyController.update)
  .delete(authorize(Role.Admin), replyController.remove)

module.exports = router;
