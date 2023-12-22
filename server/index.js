const express = require("express");
const cors = require("cors");
const app = express();
const {
  generateFile,
} = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  //console.log("language", req.body);
  if (code === undefined) {
    return res.status(400).json({
      status: "fail",
      message: "Code is empty",
    });
  }
  try {
    const filePath = await generateFile(
      language,
      code
    );
    let output;
    if (language === "cpp") {
      output = await executeCpp(filePath);
    } else if (language === "py") {
      output = await executePy(filePath);
    }
    return res.status(200).json({
      filePath,
      output,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
});
app.listen(8080, () => {
  console.log("App is running on port 8080...");
});
