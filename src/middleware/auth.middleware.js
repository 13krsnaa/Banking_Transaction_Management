const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);
    req.user = user;
    return next();

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
}
async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; //basic check ki token hai ya nahi
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //token ko verify krna
    const user = await userModel.findById(decoded.userId).select("+systemUser"); //user ko find krna aur systemUser field ko include krna
    if (!user || !user.systemUser) {
      return res
        .status(403)
        .json({
          message: "Access denied. Only system users can perform this action.",
        });
    }
    req.user = user;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
}
module.exports = {
  authMiddleware,
  authSystemUserMiddleware,
};
