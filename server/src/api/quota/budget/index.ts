import * as BudgetCategoryController from "../categories";
import { DocumentReference } from "../gateway/persistence";
import * as BudgetMonthController from "../months";
import * as BudgetScheduledController from "../scheduled";
import BudgetSuggested from "./model";

export const test = async (
  userRef: DocumentReference,
  date: Date
): Promise<{
  underfunded: number;
  underfundedCategories: { [key: string]: string };
}> => {
  const futureBudgetMap: { [key: string]: BudgetSuggested } = {};
  const underfundedCategories: { [key: string]: string } = {};
  let underfunded = 0;

  await BudgetCategoryController.getAllCategories(userRef).then(
    async (categories) => {
      await Promise.all(
        categories.map((category) =>
          BudgetMonthController.getMonth(userRef, {
            categoryId: category,
            date: new Date(),
          }).then(
            (month) =>
              (futureBudgetMap[category.name] = new BudgetSuggested({
                explicit: {
                  goalCreationMonth: this.goalCreationMonth,
                  goalTarget: category.goalTarget,
                  goalTargetMonth: category.goalTargetMonth,
                  goalType: category.goalType,
                  goalPriority: category.goalPriority,
                  name: category.name,
                  scheduled: 0,
                  underfunded: 0,
                  balance: month.balance,
                },
              }))
          )
        )
      );
    }
  );

  await BudgetScheduledController.createFutureScheduledTransactions(
    userRef,
    date
  ).then((scheduledTransactions) =>
    scheduledTransactions.forEach((scheduledTransaction) => {
      const existing = futureBudgetMap[scheduledTransaction.categoryName];
      if (existing) {
        existing.scheduled += scheduledTransaction.amount;
        existing.balance += scheduledTransaction.amount;
      }
    })
  );

  Object.values(futureBudgetMap).forEach((category) => {
    const paychecks = 1;

    category.underfunded =
      (category.goalTarget && category.goalTarget - category.balance) ||
      (category.balance < 0 && Math.abs(category.balance)) ||
      0;

    category.underfunded =
      category.underfunded > 0.1 ? category.underfunded / (paychecks || 1) : 0;

    if (category.underfunded) {
      underfunded += category.underfunded;
      underfundedCategories[category.name] =
        "$" + category.underfunded.toFixed(2);
    }
  });

  return {
    underfunded,
    underfundedCategories,
  };
};
