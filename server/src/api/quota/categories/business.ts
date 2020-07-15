import { Category } from "plaid";
import { BudgetCategory, createCategory } from ".";
import { DocumentReference } from "../../gateway/persistence";
import * as BudgetTransactionController from "../transactions";

export const createDefaultCategories = async (
  userId: DocumentReference,
  categories: Category[]
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
    categoryRef: category,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionController.updateTransaction(transaction, {
          categoryName: category.name,
        })
      )
    )
  );

  return category;
};
