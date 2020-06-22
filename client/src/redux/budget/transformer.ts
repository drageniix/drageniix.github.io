import budget from "../../assets/budget.json";
import { addDates, flatten, frequencyMap } from "../../utilities/budget";
import { Budget, ScheduledTransaction } from "../types/budget.types";

const newBudget: Budget = {
  ...budget,
  scheduledTransactions: addAdditionalScheduledTransactions(
    budget.scheduled,
    new Date("2020-07-10")
  ),
};

export default newBudget;

function addAdditionalScheduledTransactions(
  scheduledTransactions: ScheduledTransaction[],
  scheduledUntil: Date
): ScheduledTransaction[] {
  const allFutureTransactions: ScheduledTransaction[] = flatten(
    scheduledTransactions
      .filter(
        (scheduledTransaction) =>
          scheduledTransaction.frequency &&
          !!frequencyMap[scheduledTransaction.frequency]
      )
      .map((scheduledTransaction) => {
        let date = new Date(scheduledTransaction.date_next);
        let newScheduledTransactions: ScheduledTransaction[] = [];

        addDates(scheduledTransaction.frequency, date);

        // add days to transaction date until out of scope
        while (date <= scheduledUntil) {
          const newTransaction = {
            ...scheduledTransaction,
            date_next: date.toISOString().slice(0, 10),
          };
          newScheduledTransactions.push(newTransaction);
          addDates(scheduledTransaction.frequency, date);
        }
        return newScheduledTransactions;
      })
  );

  // Add corresponding transfers between accounts so balance is accurate
  scheduledTransactions.forEach((scheduledTransaction) => {
    if (
      !!scheduledTransaction.transfer_account_id &&
      !scheduledTransaction.category_id
    ) {
      allFutureTransactions.push({
        ...scheduledTransaction,
        amount: -scheduledTransaction.amount,
        account_id: scheduledTransaction.transfer_account_id,
        account_name: scheduledTransaction.transfer_account_name,
        transfer_account_id: scheduledTransaction.account_id,
        transfer_account_name: scheduledTransaction.account_name,
        id: scheduledTransaction.id + "_t",
      });
    }
  });

  return scheduledTransactions.concat(allFutureTransactions);
}
