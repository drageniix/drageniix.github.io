"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountsFromInstitution = exports.createAndPostMatchingPayee = exports.updateLinkedAccountName = exports.addManualAccount = void 0;
const _1 = require(".");
const BudgetInstitutionController = __importStar(require("../institution"));
const BudgetPayeeController = __importStar(require("../payees"));
const BudgetScheduledController = __importStar(require("../scheduled"));
const BudgetTransactionController = __importStar(require("../transactions"));
exports.addManualAccount = (userRef, { name, type, subtype, institutionId, note, onBudget, }) => __awaiter(void 0, void 0, void 0, function* () {
    const institution = BudgetInstitutionController.getInstitutionReferenceById(userRef, institutionId);
    return _1.createAccount({
        explicit: {
            userId: userRef,
            institutionId: institution,
            name,
            type,
            subtype,
            note,
            onBudget,
        },
    });
});
exports.updateLinkedAccountName = (account) => __awaiter(void 0, void 0, void 0, function* () {
    //Update transactions connected to the account
    yield BudgetTransactionController.getAllTransactions(account.userId, {
        accountId: account.id,
    }).then((transactions) => Promise.all(transactions.map((transaction) => BudgetTransactionController.updateTransaction(transaction, {
        accountName: account.name,
    }))));
    //Update scheduled transactions connected to the account
    yield BudgetScheduledController.getAllScheduleds(account.userId, {
        accountId: account.id,
    }).then((scheduleds) => Promise.all(scheduleds.map((scheduled) => BudgetScheduledController.updateScheduled(scheduled, {
        accountName: account.name,
    }))));
    // Update payee connected to the account, and all transactions with that payee
    yield BudgetPayeeController.getPayee(account.userId, {
        payeeId: account.transferPayeeId,
    })
        .then((payee) => {
        payee.name = `TRANSFER: ${account.name}`;
        return BudgetPayeeController.updatePayee(payee, {
            transferAccountName: account.name,
        });
    })
        .then((payee) => BudgetTransactionController.getAllTransactions(account.userId, {
        payeeId: payee.id,
    }).then((transactions) => Promise.all(transactions.map((transaction) => BudgetTransactionController.updateTransaction(transaction, {
        payeeName: payee.name,
    })))));
    return account;
});
exports.createAndPostMatchingPayee = (account) => __awaiter(void 0, void 0, void 0, function* () {
    const payee = yield BudgetPayeeController.createAndPostPayee({
        userId: account.userId,
        name: `TRANSFER: ${account.name}`,
        transferAccountId: account.id,
        transferAccountName: account.name,
    });
    yield _1.updateAccount(account, {
        transferPayeeId: payee.id,
        transferPayeeName: payee.name,
    });
    return { account: account, payee };
});
exports.createAccountsFromInstitution = (institution, accounts) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(accounts.map((account) => _1.createAccount({
        explicit: {
            userId: institution.userId,
            institutionId: institution.id,
            name: account.name,
            originalName: account.official_name,
            availableBalance: account.balances.available,
            currentBalance: account.balances.current,
            startingBalance: account.balances.current,
            type: account.type,
            subtype: account.subtype,
            plaidAccountId: account.account_id,
        },
    })));
});
