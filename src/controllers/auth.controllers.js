const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// user register controller
// Ye post request : /api/auth/register ko control krega (line 6 - 39)
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  });

  if (isExist) {
    return res.status(422).json({
      message: "User already exists with this email",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);
  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}
// user login controller
//ye post request : /api/auth/login ko control krega
async function userLoginController(req, res) {
  const { email, password } = req.body;

  //ye pass ko queary me include krke user ko find krke dega
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      message: "Invalid email or password",
      status: "failed",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(404).json({
      message: "Invalid email or password",
      status: "failed",
    });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);
  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}
module.exports = {
  userRegisterController,
  userLoginController,
};
