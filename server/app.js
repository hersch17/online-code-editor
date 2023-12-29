const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./db/connectDB.js");
const codeRouter = require("./routers/codeRouter");
const userRouter = require("./routers/userRouter.js");
const morgan = require("morgan");

app.use(cors(
  {
    origin: ["https://online-code-editor-omega.vercel.app"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/v1/run", codeRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;

// app.post("/run", async (req, res) => {
//   const { language = "cpp", code } = req.body;
//   //console.log("language", req.body);
//   if (code === undefined) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Code is empty",
//     });
//   }
//   let job;
//   try {
//     const filePath = await generateFile(
//       language,
//       code
//     );
//     job = await Code.create({
//       language,
//       filePath,
//       code,
//     });
//     const jobID = job["_id"];

//     //console.log(job);
//     let output;
//     job["startedAt"] = new Date();
//     if (language === "cpp") {
//       output = await executeCpp(filePath);
//     } else if (language === "py") {
//       output = await executePy(filePath);
//     }
//     job["completedAt"] = new Date();
//     job["status"] = "complete";
//     job["output"] = output;
//     await job.save();
//     return res.status(200).json({
//       filePath,
//       output,
//       jobID,
//     });
//   } catch (err) {
//     job["completedAt"] = new Date();
//     job["status"] = "error";
//     job["output"] = JSON.stringify(err);
//     await job.save();
//     res.status(500).json({ err });
//   }
// });
