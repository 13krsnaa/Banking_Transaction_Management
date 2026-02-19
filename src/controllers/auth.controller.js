const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExists = userModel.findOne({
    email: email,
  });
  if (isExists) {
    return res.status(422).json({
      message: "User already exists",
      status: "failed",
    });
  }
  const user = userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5d",
  });
  res.cookies("token", token);
  res.status(201).json({
    user: {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    },
  });
}

module.exports = {
  userRegisterController,
};
