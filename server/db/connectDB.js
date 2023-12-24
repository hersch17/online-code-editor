const mongoose = require("mongoose");
const connectDB = (uri) => {
  return mongoose
    .connect(uri, {})
    .then((con) => {
      //console.log(con);
      console.log("Connected to DB!");
    })
    .catch((err) => console.log(err));
};
module.exports = connectDB;
