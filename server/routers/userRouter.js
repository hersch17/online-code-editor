const express = require("express");
const {
  createUser,
  findUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(createUser);
router.route("/login").post(findUser);

module.exports = router;
