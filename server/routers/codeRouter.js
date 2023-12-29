const express = require("express");
const {
  createCode,
  findCode,
  getAllCodes,
  findUserCodes,
  deleteCode,
} = require("../controllers/codeController");

const router = express.Router();

router
  .route("/")
  .post(createCode)
  .get(getAllCodes);
router
  .route("/:id")
  .get(findCode)
  .delete(deleteCode);
router.route("/codes").post(findUserCodes);
module.exports = router;
