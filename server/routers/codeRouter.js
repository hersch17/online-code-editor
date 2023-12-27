const express = require("express");
const {
  createCode,
  findCode,
  getAllCodes,
} = require("../controllers/codeController");

const router = express.Router();

router
  .route("/")
  .post(createCode)
  .get(getAllCodes);
router.route("/:id").get(findCode);

module.exports = router;
