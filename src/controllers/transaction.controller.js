const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.services");
const mongoose = require("mongoose");

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
  //Step 1 in this function => 1. validate the request  ---req.body se aane wala data ko verify karna
  /**
   * Step 1 : Vaildate the request
   */
  const { freomAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount and idempotencyKey are required",
      status: "failed",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  /**
   * step 2: validate idempotency key
   */

  const isTransactionalreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });
  if (isTransactionalreadyExists) {
    if (isTransactionalreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionalreadyExists,
      });
    }
    if (isTransactionalreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is already in process",
        transaction: isTransactionalreadyExists,
      });
    }
    if (isTransactionalreadyExists.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction attempt failed. Please try again.",
        transaction: isTransactionalreadyExists,
      });
    }
    if (isTransactionalreadyExists.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction has been reversed.Please retry.",
        transaction: isTransactionalreadyExists,
      });
    }
  }

  /**
   * step 3: check account status
   */
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.send(400).json({
      message:
        "Both sender and receiver accounts must be active to process the transaction",
    });
  }

  /**
   * step 4: Derive sender balance from the ledger
   */

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `insufficient funds. Current balance is ${balance}`,
    });
  }

  /**
   *  Step 5: Create transaction  with pending status
   */
  const session = await mongoose.stratSession();
  session.startTransaction();

  const transaction = await transaction.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endsession();
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
