const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.conntrollers");

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account for user
 * - Protected route
 */
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);
router.get(
  "/",
  authMiddleware.authMiddleware,
  accountController.getUserAccountsController,
);

module.exports = router;
