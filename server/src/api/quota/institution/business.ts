import { BudgetInstitution, updateInstitution } from ".";
import { getPlaidTransactions, PlaidTransaction } from "../gateway/plaid";

export const importPlaidTransactionsFromInstitution = async (
  institution: BudgetInstitution,
  { startDate, endDate }: { startDate?: string; endDate?: string }
): Promise<PlaidTransaction[]> => {
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
