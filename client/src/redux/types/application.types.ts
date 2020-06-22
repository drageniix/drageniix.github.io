import { Budget } from "./budget.types";

export interface ApplicationState {
  message?: string;
  budget: Budget;
}
