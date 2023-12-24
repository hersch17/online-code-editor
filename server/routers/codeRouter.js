const express = require("express");
const {
  createCode,
} = require("../controllers/codeController");

const router = express.Router();

router.route("/").post(createCode);

module.exports = router;
