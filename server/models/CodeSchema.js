const mongoose = require("mongoose");

const CodeSchema = mongoose.Schema({
  language: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: [true, "Every code has a email"],
  },
  name: {
    type: String,
    required: [
      true,
      "Every code file has a name.",
    ],
  },
});

const Code = mongoose.model("Code", CodeSchema);

module.exports = Code;
