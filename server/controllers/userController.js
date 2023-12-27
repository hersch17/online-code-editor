const User = require("../models/UserSchema");
exports.createUser = async (req, res) => {
  await User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

exports.findUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req);
  console.log(email, password);
  await User.findOne({ email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.status(200).json({
            status: "success",
            message: "User exists",
          });
        } else {
          res.status(404).json({
            status: "fail",
            message: "Incorrect password",
          });
        }
      } else {
        res.status(200).json({
          status: "fail",
          message: "User doesn't exist",
        });
      }
    })
    .catch((err) => res.json(err));
};
