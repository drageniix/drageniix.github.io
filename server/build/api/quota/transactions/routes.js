"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BudgetTransactionController = __importStar(require("."));
const express_2 = require("../gateway/express");
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.get(
  "/",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetTransactionController.getAllTransactions(req.userId, {
      accountId: req.query.accountId,
      payeeId: req.query.payeeId,
      categoryId: req.query.categoryId,
      flagColor: req.query.flagColor,
    }).then((transactions) =>
      res.status(200).json({
        transactions: transactions.map((transaction) =>
          transaction.getDisplayFormat()
        ),
      })
    )
  )
);
router.post(
  "/",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetTransactionController.addManualTransaction(req.userId, {
      accountId: req.body.accountId,
      payeeId: req.body.payeeId,
      categoryId: req.body.categoryId,
      amount: req.body.amount,
      date: req.body.date,
      cleared: req.body.cleared,
      flagColor: req.body.flagColor,
      note: req.body.note,
    })
      .then((transaction) =>
        BudgetTransactionController.postTransaction(transaction)
      )
      .then((transaction) =>
        res.status(200).json(transaction.getDisplayFormat())
      )
  )
);
router.get(
  "/:transactionId",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetTransactionController.getTransaction(
      req.userId,
      req.params.transactionId
    ).then((transaction) =>
      res.status(200).json(transaction.getDisplayFormat())
    )
  )
);
router.put(
  "/:transactionId",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetTransactionController.getTransaction(
      req.userId,
      req.params.transactionId
    )
      .then((transaction) =>
        BudgetTransactionController.updateTransaction(transaction, {
          amount: req.body.amount,
          date: req.body.date,
          note: req.body.note,
          cleared: req.body.cleared,
          flagColor: req.body.flagColor,
        })
      )
      .then((transaction) =>
        res.status(200).json(transaction.getDisplayFormat())
      )
  )
);
router.post(
  "/:transactionId/duplicate",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetTransactionController.getTransaction(
      req.userId,
      req.params.transactionId
    )
      .then((transaction) =>
        BudgetTransactionController.addManualTransaction(req.userId, {
          accountId: transaction.accountId,
          categoryId: transaction.categoryId,
          payeeId: transaction.payeeId,
          amount: req.body.amount,
          date: req.body.date,
          cleared: req.body.cleared,
          note: req.body.note,
          flagColor: req.body.flagColor,
        })
      )
      .then((transaction) =>
        BudgetTransactionController.postTransaction(transaction)
      )
      .then((transaction) =>
        res.status(200).json(transaction.getDisplayFormat())
      )
  )
);
router.post(
  "/import",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      return BudgetTransactionController.getPlaidTransactionsFromInstitution(
        req.userId,
        {
          startDate: req.query.startDate,
          endDate: req.query.endDate,
        }
      )
        .then((transactions) =>
          BudgetTransactionController.postTransactions(transactions)
        )
        .then((transactions) =>
          res
            .status(200)
            .json(
              transactions.map((transaction) => transaction.getDisplayFormat())
            )
        );
    })
  )
);
exports.default = router;
