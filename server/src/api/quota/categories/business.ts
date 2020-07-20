import { BudgetCategory, createCategory } from ".";
import { DocumentReference } from "../gateway/persistence";
import { PlaidCategory } from "../gateway/plaid";
import * as BudgetScheduledController from "../scheduled";
import * as BudgetTransactionController from "../transactions";
import * as BudgetMonthController from "./months";

export const createDefaultCategories = async (
  userId: DocumentReference,
  categories: PlaidCategory[]
): Promise<BudgetCategory[]> => {
  const categoryMap: { [key: string]: string[] } = categories.reduce(
    (prev, curr) => {
      // exisiting or new main category add id
      const key = curr.hierarchy[0];
      (prev[key] || (prev[key] = [])).push(curr.category_id);
      return prev;
    },
    {}
  );

  return Object.entries(categoryMap).map(([key, value]) =>
    createCategory({
      explicit: {
        name: key,
        plaidCategoryIds: value,
        userId: userId,
      },
    })
  );
};

export const updateLinkedCategoryName = async (
  category: BudgetCategory
): Promise<BudgetCategory> => {
  await BudgetTransactionController.getAllTransactions(category.userId, {
    categoryId: category,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionController.updateTransaction(transaction, {
          categoryName: category.name,
        })
      )
    )
  );

  await BudgetScheduledController.getAllScheduleds(category.userId, {
    categoryId: category,
  }).then((scheduleds) =>
    Promise.all(
      scheduleds.map((scheduled) =>
        BudgetScheduledController.updateScheduled(scheduled, {
          categoryName: category.name,
        })
      )
    )
  );

  return category;
};

export const updateCategoryMonthBalance = async (
  userRef: DocumentReference,
  category: BudgetCategory,
  { date }: { date: string }
): Promise<BudgetCategory> =>
  BudgetMonthController.getMonth(userRef, {
    categoryId: category,
    monthId: date,
  })
    .then(async (month) => {
      const startDate = new Date(month.date);
      const endDate = new Date(month.date);
      endDate.setMonth(endDate.getMonth() + 1);

      const transactions = await BudgetTransactionController.getAllTransactions(
        userRef,
        {
          startDate: `${
            startDate.getFullYear
          }-${startDate.getMonth()}-${startDate.getDate()}`,
          endDate: `${
            endDate.getFullYear
          }-${endDate.getMonth()}-${endDate.getDate()}`,
          categoryId: category,
          cleared: true,
        }
      );

      await BudgetMonthController.updateCategoryMonth(month, {
        activity: transactions.reduce((prev, curr) => prev + curr.amount, 0),
      });
    })
    .then(() => category);
