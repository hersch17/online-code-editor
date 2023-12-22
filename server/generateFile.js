const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { log } = require("console");
const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, code) => {
  // console.log(
  //   "from backend",
  //   "format",
  //   format,
  //   "code",
  //   code
  // );
  const jobID = uuid();
  const fileName = `${jobID}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = {
  generateFile,
};
