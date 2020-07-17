import { Transaction } from "plaid";
import { BudgetInstitution, updateInstitution } from ".";
import { getPlaidTransactions } from "../gateway/plaid";

export const importPlaidTransactionsFromInstitution = async (
  institution: BudgetInstitution,
  { startDate, endDate }: { startDate?: string; endDate?: string }
): Promise<Transaction[]> => {
  const adjustedStartDate =
    startDate || institution.updatedAt.toISOString().slice(0, 10);
  const adjustedEndDate = endDate || new Date().toISOString().slice(0, 10);

  const { transactions } = await getPlaidTransactions(
    institution.plaidAccessToken,
    adjustedStartDate,
    adjustedEndDate
  );

  await updateInstitution(institution, {
    updatedAt: new Date(adjustedEndDate),
  });

  return transactions;
};
