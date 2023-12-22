const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

//const { stdout, stderr } = require("process");
//const { log } = require("console");
const outputPath = path.join(
  __dirname,
  "outputs"
);
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const executeCpp = (filePath) => {
  const jobID = path
    .basename(filePath)
    .split(".")[0];
  const outPath = path.join(
    outputPath,
    `${jobID}.exe`
  );
  const pr = new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${jobID}.exe`,

      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
  pr.catch((error) => {
    console.log(error);
  });
  return pr;
};

module.exports = { executeCpp };
