const Code = require("../models/CodeSchema");
const dict = {
  54: "cpp",
  93: "js",
  71: "py",
};
exports.createCode = async (req, res) => {
  const { language, code, name, email } =
    req.body;
  //console.log(req.body);
  // if (code === undefined) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "Code is empty",
  //   });
  // }
  let job;
  try {
    console.log(language, code, name, email);

    job = await Code.create({
      language,
      code,
      name,
      email,
    });

    const jobID = job["_id"];
    return res.status(200).json({
      status: "success",
      jobID,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "fail",
    });
  }
};
exports.findCode = async (req, res) => {
  const id = req.params.id;
  let job;
  try {
    job = await Code.findById(id);
    res.status(201).json({
      status: "success",
      job,
    });
  } catch (err) {
    res.status(404).json({
      err,
      status: "fail",
    });
  }
};
exports.getAllCodes = async (req, res) => {
  let job;
  try {
    job = await Code.find({});
    res.status(201).json({
      status: "success",
      job,
    });
  } catch (err) {
    res.status(404).json({
      err,
      status: "fail",
    });
  }
};
exports.findUserCodes = async (req, res) => {
  let job;
  console.log(req.body);
  try {
    job = await Code.find({
      email: req.body.email,
    });
    res.status(201).json({
      status: "success",
      job,
    });
  } catch (err) {
    res.status(404).json({
      err,
      status: "fail",
    });
  }
};
exports.deleteCode = async (req, res) => {
  const tour = await Code.findByIdAndDelete(
    req.params.id
  );
  res.status(204).json({
    status: "success",
    data: tour,
  });
};

// exports.createCode = async (req, res) => {
//   const { language = "cpp", code } = req.body;
//   //console.log(req.body);
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
//     let output;
//     job["startedAt"] = new Date();
//     // if (language === "cpp") {
//     //   output = await executeCpp(filePath);
//     // } else if (language === "py") {
//     //   output = await executePy(filePath);
//     // }
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
//     res.status(500).json({
//       err,
//       status: "fail",
//     });
//   }
// };
