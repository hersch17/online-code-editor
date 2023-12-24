const mongoose = require("mongoose");

const dotenv = require("dotenv").config();

//dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DB_URI;
mongoose.connect(DB, {}).then((con) => {
  //console.log(con.connections);
  console.log("DB connection successful");
});

// const testTour = new Tour({
//   name: 'The Kite Runner',
//   price: 599,
//   rating: 3.6,
// });
// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('Error', err));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//test
