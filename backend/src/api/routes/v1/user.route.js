const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/user.controller");
const { authorize } = require("../../middlewares/authorize");
const { Role } = require("../../../config/config");
const { updateUser } = require("../../validations/user.validation");

const router = express.Router();

router.param("userId", controller.load);
router.route("/").get(authorize(Role.Admin), controller.list);

router.route("/me").patch(authorize(), controller.updateMe);

router
  .route("/:userId")
  .get(authorize(Role.Admin), controller.get)
  .patch(authorize(Role.Admin), validate(updateUser), controller.update)
  .delete(authorize(Role.Admin), controller.remove);

module.exports = router;
