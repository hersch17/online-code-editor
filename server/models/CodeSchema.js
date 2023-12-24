const mongoose = require("mongoose");

const CodeSchema = mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ["cpp", "py"],
  },
  filePath: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  output: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "complete", "error"],
  },
  // username: {
  //   type: String,
  //   required: [true, "Every code has a username"],
  // },
});

const Code = mongoose.model("Code", CodeSchema);

module.exports = Code;
