import { BudgetScheduled, createScheduled, getAllScheduleds } from ".";
import * as BudgetAccountController from "../account";
import * as BudgetCategoryController from "../categories";
import {
  DocumentReference,
  documentReferenceType,
} from "../gateway/persistence";
import * as BudgetPayeeController from "../payees";

export const addManualScheduledTransaction = async (
  userRef: DocumentReference,
  {
    accountId,
    payeeId,
    categoryId,
    amount,
    date,
    note,
    flagColor,
    frequency,
  }: {
    accountId: documentReferenceType;
    payeeId: documentReferenceType;
    categoryId: documentReferenceType;
    amount: number;
    date: string;
    note: string;
    flagColor: string;
    frequency?: string;
  }
): Promise<BudgetScheduled> => {
  const account = await BudgetAccountController.getAccount(userRef, {
    accountId: accountId,
  });
  const payee = await BudgetPayeeController.getPayee(userRef, {
    payeeId: payeeId,
  });

  const category = await BudgetCategoryController.getCategory(userRef, {
    categoryId: categoryId,
  });

  return createScheduled({
    explicit: {
      accountId: account.id,
      accountName: account.name,
      amount: amount,
      note: note,
      date: new Date(date),
      payeeId: payee.id,
      payeeName: payee.name,
      userId: userRef,
      categoryId: category.id,
      categoryName: category.name,
      frequency,
      flagColor,
    },
  });
};

export const frequencyMap: { [key: string]: number } = {
  weekly: 7,
  everyOtherWeek: 14,
  everyOtherMonth: 2,
  monthly: 1,
  yearly: 1,
  twiceAYear: 6,
};

export const addDates = (frequency: string, date: Date): Date => {
  const newDate = new Date(date);
  switch (frequency) {
    case "yearly":
      newDate.setFullYear(newDate.getFullYear() + frequencyMap[frequency]);
      break;
    case "monthly":
    case "twiceAYear":
    case "everyOtherMonth":
      newDate.setMonth(newDate.getMonth() + frequencyMap[frequency]);
      break;
    case "weekly":
    case "everyOtherWeek":
    default:
      newDate.setDate(newDate.getDate() + frequencyMap[frequency]);
      break;
  }
  return newDate;
};

export const createFutureScheduledTransactions = (
  userRef: DocumentReference,
  scheduledUntil: Date
): Promise<BudgetScheduled[]> =>
  getAllScheduleds(userRef, { scheduledUntil }).then((scheduleds) => {
    const dateMappedScheduledTransactions: BudgetScheduled[] = [];
    scheduleds.forEach((scheduledTransaction) => {
      if (
        scheduledTransaction.frequency &&
        !!frequencyMap[scheduledTransaction.frequency]
      ) {
        let date = addDates(
          scheduledTransaction.frequency,
          scheduledTransaction.date
        );

        // add days to transaction date until out of scope
        while (date < scheduledUntil) {
          const newTransaction = createScheduled({
            explicit: {
              ...scheduledTransaction,
              date,
            },
          });
          dateMappedScheduledTransactions.push(newTransaction);
          date = addDates(scheduledTransaction.frequency, date);
        }
      }
    });

    return dateMappedScheduledTransactions.sort(
      (t1, t2) => t1.date.getTime() - t2.date.getTime()
    );
  });
