const { Router } = require("express");

const transactionRoutes = Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");

//POST request: /api/transactions/ ye nya transction create krega

transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

transactionRoutes.post(
  "/system/initial-funds",
  authMiddleware.authSystemUserMiddleware,
  transactionController.createInitialFundsTransaction,
);

module.exports = transactionRoutes;
