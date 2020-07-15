import { BudgetInstitution, updateInstitution } from ".";

export const setUpdatedAt = (insitution: BudgetInstitution, date: string) =>
  updateInstitution(insitution, { updatedAt: new Date(date) });
