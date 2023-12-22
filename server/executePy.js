const { exec } = require("child_process");

const executePy = (filePath) => {
  const promise1 = new Promise(
    (resolve, reject) => {
      exec(
        `python ${filePath}`,
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
    }
  );
  promise1.catch((error) => {
    console.log(error);
  });
  return promise1;
};

module.exports = { executePy };
