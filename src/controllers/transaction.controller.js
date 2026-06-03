const transactionModel = require("../models/transaction.model");

const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.services");

//* Ye controller me ham apne app ke sare business logic ko implement krte hai *//
// Creating a new transaction in 10 steps
/*
    1. validate the request  ---req.body se aane wala data ko verify karna 
    2. vaidate idempotency key
    3. check account status
    4.  sender balance from the ledger
    5. create PENDING transaction
    6. create DEBIT ledger entry
    7. create CREDIT ledger entry 
    8. marking the transaction as completed 
    9. commit the transacction
    10. send email notification to the user
    */

async function createTransaction(req, res) {
  const { freomAccount, toAccount, amount, idempotencyKey } = req.body;
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;
  if (!tooAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required",
      status: "failed",
    });
  }
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });
  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  const fronUserAccount = await accountModel.findOne({
    systemAccount: true,
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System account not found for the user",
    });
  }

  const session = await mongoose.startsession();
  session.startTransaction();

  const transactionModel = new transactionModel({
    fromAccount: formUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromUserAccount._id,
      transaction: transaction._id,
      amount,
      type: "DEBIT",
    },
    { session }, // yha session use krne ka matlba hai ki data yha array ki form me save hoga .
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toUserAccount._id,
      transaction: transaction._id,
      amount,
      type: "CREDIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction created successfully",
    transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
