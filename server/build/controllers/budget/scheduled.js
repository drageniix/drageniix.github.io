"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planScheduledTransactions = void 0;
const utils_1 = require("./utils");
function addTransferBasedScheduledTransactions(scheduledTransaction, dateMappedScheduledTransactions) {
    if (!!scheduledTransaction.transfer_account_id &&
        !scheduledTransaction.category_id) {
        dateMappedScheduledTransactions.push(Object.assign(Object.assign({}, scheduledTransaction), { amount: -scheduledTransaction.amount, account_id: scheduledTransaction.transfer_account_id, account_name: scheduledTransaction.transfer_account_name, transfer_account_id: scheduledTransaction.account_id, transfer_account_name: scheduledTransaction.account_name, id: scheduledTransaction.id + "_t" }));
    }
}
function addFrequencyBasedScheduledTransactions(scheduledTransaction, scheduledUntil, dateMappedScheduledTransactions) {
    if (scheduledTransaction.frequency &&
        !!utils_1.frequencyMap[scheduledTransaction.frequency]) {
        let date = new Date(scheduledTransaction.date_next);
        utils_1.addDates(scheduledTransaction.frequency, date);
        // add days to transaction date until out of scope
        while (date < scheduledUntil) {
            const newTransaction = Object.assign(Object.assign({}, scheduledTransaction), { date_next: new Date(date), id: scheduledTransaction.id + "_" + date.toISOString().slice(0, 10) });
            dateMappedScheduledTransactions.push(newTransaction);
            utils_1.addDates(scheduledTransaction.frequency, date);
        }
    }
}
exports.planScheduledTransactions = (scheduledTransactions, scheduledUntil) => {
    const dateMappedScheduledTransactions = scheduledTransactions
        .map((transaction) => (Object.assign(Object.assign({}, transaction), { date_next: new Date(transaction.date_next) })))
        .filter((transaction) => transaction.date_next < scheduledUntil);
    dateMappedScheduledTransactions.forEach((scheduledTransaction) => {
        addFrequencyBasedScheduledTransactions(scheduledTransaction, scheduledUntil, dateMappedScheduledTransactions);
        addTransferBasedScheduledTransactions(scheduledTransaction, dateMappedScheduledTransactions);
    });
    return dateMappedScheduledTransactions.sort((t1, t2) => t1.date_next.getTime() - t2.date_next.getTime());
};
