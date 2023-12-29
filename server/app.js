const express = require("express");
const cors = require("cors");
const app = express();
const codeRouter = require("./routers/codeRouter");
const userRouter = require("./routers/userRouter.js");
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(cors());
app.options("*", cors());
// cors({
//   origin: [
//     "https://online-code-editor-q2je.vercel.app/",
//   ],
//   methods: ["POST", "GET", "DELETE"],
//   credentials: true,
// })
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(
  bodyParser.urlencoded({ extended: true })
);
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.get("/", (req, res) => {
  res.json("API for online editor");
});
app.use("/api/v1/run", codeRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
