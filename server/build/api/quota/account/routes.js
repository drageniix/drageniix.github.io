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
const BudgetAccountController = __importStar(require("."));
const express_2 = require("../gateway/express");
const plaid_1 = require("../../gateway/plaid");
const BudgetInstitutionController = __importStar(require("../institution"));
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.get(
  "/",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetAccountController.getAllAccounts(req.userId, {
      institutionRef: req.params.institutionId,
    }).then((accounts) =>
      res
        .status(200)
        .json(accounts.map((account) => account.getDisplayFormat()))
    )
  )
);
router.post(
  "/",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetAccountController.createAndPostAccount(
      Object.assign(Object.assign({}, req.body), { userId: req.userId })
    )
      .then((account) => BudgetAccountController.createMatchingPayee(account))
      .then(({ account }) => res.status(200).json(account.getDisplayFormat()))
  )
);
router.post(
  "/populate",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const institution = yield BudgetInstitutionController.getInstitution(
        req.userId,
        req.body.institutionId
      );
      const { accounts } = yield plaid_1.getPlaidAccounts(
        institution.plaidAccessToken
      );
      return BudgetAccountController.createAccountsFromInstitution(
        institution,
        accounts.filter(
          (account) =>
            !req.body.accounts || req.body.accounts.includes(account.account_id)
        )
      )
        .then((accounts) => BudgetAccountController.postAccounts(accounts))
        .then((accounts) =>
          res
            .status(200)
            .json(accounts.map((account) => account.getDisplayFormat()))
        );
    })
  )
);
router.get(
  "/:accountId",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetAccountController.getAccount(req.userId, {
      accountRef: req.params.accountId,
    }).then((account) => res.status(200).json(account.getDisplayFormat()))
  )
);
router.put(
  "/:accountId",
  common_1.isAuth,
  express_2.asyncWrapper((req, res) =>
    BudgetAccountController.getAccount(req.userId, {
      accountRef: req.params.accountId,
    })
      .then((account) =>
        req.body.name && req.body.name !== account.name
          ? BudgetAccountController.updateAccount(account, {
              name: req.body.name,
            }).then((account) =>
              BudgetAccountController.updateLinkedAccountName(account)
            )
          : account
      )
      .then((account) => res.status(200).json(account.getDisplayFormat()))
  )
);
exports.default = router;
