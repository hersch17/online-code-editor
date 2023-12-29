const mongoose = require("mongoose");

const dotenv = require("dotenv").config();

const app = require("./app");

const DB = process.env.DB_URI;
mongoose.connect(DB, {}).then((con) => {
  //console.log(con.connections);
  console.log("DB connection successful");
});
app.get("/", (req, res) => {
  res.json("API for online editor");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//test
