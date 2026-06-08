const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });
  res.status(201).json({
    account,
  });
}

async function getUserAccountsController(req, res) {
  const user = req.user;
  const accounts = await accountModel.find({ user: user._id });
  res.status(200).json({ accounts });
}

module.exports = {
  createAccountController,
  getUserAccountsController,
};
