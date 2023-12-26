const Code = require("../models/CodeSchema");
const {
  generateFile,
} = require("../utils/generateFile");
const {
  executeCpp,
} = require("../utils/executeCpp");
const {
  executePy,
} = require("../utils/executePy");

exports.createCode = async (req, res) => {
  const { language = "cpp", code } = req.body;
  //console.log(req.body);
  if (code === undefined) {
    return res.status(400).json({
      status: "fail",
      message: "Code is empty",
    });
  }
  let job;
  try {
    const filePath = await generateFile(
      language,
      code
    );

    job = await Code.create({
      language,
      filePath,
      code,
    });

    const jobID = job["_id"];
    let output;
    job["startedAt"] = new Date();
    // if (language === "cpp") {
    //   output = await executeCpp(filePath);
    // } else if (language === "py") {
    //   output = await executePy(filePath);
    // }
    job["completedAt"] = new Date();
    job["status"] = "complete";
    job["output"] = output;
    await job.save();
    return res.status(200).json({
      filePath,
      output,
      jobID,
    });
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(err);
    await job.save();
    res.status(500).json({
      err,
      status: "fail",
    });
  }
};
