"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFutureBudgetMap = void 0;
const utils_1 = require("./utils");
function createFutureBudgetMapBase(categories) {
    const futureBudgetMap = {};
    categories.forEach((category) => {
        futureBudgetMap[category.name] = {
            name: category.name,
            account: category.category_group_name,
            scheduled: 0,
            futureBalance: category.balance,
            goal: category.goal_target,
            needed: 0,
            goal_type: category.goal_type,
            goal_creation_month: category.goal_creation_month,
            goal_target_month: category.goal_target_month,
        };
    });
    return futureBudgetMap;
}
function addScheduledTransactionsToFutureBudgetMap(futureBudgetMap, scheduledTransactions) {
    scheduledTransactions.forEach((transaction) => {
        const existing = futureBudgetMap[transaction.category_name];
        if (existing) {
            existing.scheduled += transaction.amount;
            existing.futureBalance += transaction.amount;
        }
    });
}
function calculateBudgetGoal(futureBudgetMap, transactionsSince, scheduledUntil, shouldCountPaychecks) {
    Object.values(futureBudgetMap).forEach((category) => {
        let paychecks = 1;
        if (shouldCountPaychecks) {
            if (category.goal_type && category.goal_target_month) {
                const goalEndDate = new Date(category.goal_target_month);
                paychecks = utils_1.countPaychecks(transactionsSince, goalEndDate);
            }
            else {
                paychecks = utils_1.countPaychecks(transactionsSince, scheduledUntil);
            }
        }
        category.needed =
            (category.goal && category.goal - category.futureBalance) ||
                (category.futureBalance < 0 && Math.abs(category.futureBalance)) ||
                0;
        category.needed =
            category.needed > 0.1 ? category.needed / (paychecks || 1) : 0;
    });
}
function mapUnderfundedCategories({ futureBudgetMap, transactionsSince, scheduledUntil, shouldCountPaychecks, }) {
    const categories = Object.values(futureBudgetMap);
    const datePercentages = utils_1.getDatePercentages({
        transactionsSince,
        scheduledUntil,
    });
    const paychecks = shouldCountPaychecks
        ? utils_1.countPaychecks(transactionsSince, scheduledUntil)
        : 1;
    const underfunded = categories.reduce((prev, curr) => prev + curr.needed, 0);
    const underfundedGroups = {};
    const underfundedCategories = {};
    categories
        .filter((category) => category.needed)
        .forEach((category) => {
        underfundedCategories[category.name] = "$" + category.needed.toFixed(2);
        underfundedGroups[category.account] =
            (underfundedGroups[category.account] || 0) + category.needed;
    });
    const extra = futureBudgetMap["Immediate Income SubCategory"].scheduled -
        underfunded * paychecks;
    const freeSpending = extra +
        futureBudgetMap["Ashley"].futureBalance +
        futureBudgetMap["Ashley"].needed +
        futureBudgetMap["Dining Out"].futureBalance +
        futureBudgetMap["Dining Out"].needed +
        futureBudgetMap["Entertainment"].futureBalance +
        futureBudgetMap["Entertainment"].needed;
    const dailyAvailable = freeSpending / datePercentages.daysLeft;
    const weeklyAvailable = dailyAvailable * (7 - datePercentages.day);
    const budget = {
        paycheck: futureBudgetMap["Immediate Income SubCategory"].scheduled,
        weeklyAvailable: "$" + weeklyAvailable.toFixed(2),
        underfunded,
        extra,
        underfundedGroups,
        underfundedCategories,
    };
    return budget;
}
exports.generateFutureBudgetMap = ({ categories, scheduledTransactions, transactionsSince, scheduledUntil, shouldCountPaychecks, }) => {
    const futureBudgetMap = createFutureBudgetMapBase(categories);
    addScheduledTransactionsToFutureBudgetMap(futureBudgetMap, scheduledTransactions);
    calculateBudgetGoal(futureBudgetMap, transactionsSince, scheduledUntil, shouldCountPaychecks);
    return mapUnderfundedCategories({
        futureBudgetMap,
        transactionsSince,
        scheduledUntil,
        shouldCountPaychecks,
    });
};
