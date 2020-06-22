export type Budget = {
  accounts: Account[];
  payees: Payee[];
  categories: Category[];
  transactions: Transaction[];
  scheduledTransactions: ScheduledTransaction[];
};

export type ScheduledTransaction = {
  id: string;
  date_first: string | Date;
  date_next: string | Date;
  frequency: string;
  amount: number;
  memo?: string;
  flag_color: string;
  account_id: string;
  account_name: string;
  payee_id: string;
  payee_name: string;
  category_id: string;
  category_name: string;
  transfer_account_id?: string;
  transfer_account_name?: string;
};

export type Transaction = {
  id: string;
  date: string | Date;
  amount: number;
  memo?: string;
  flag_color: string;
  account_id: string;
  account_name: string;
  payee_id: string;
  payee_name: string;
  category_id?: string;
  category_name?: string;
  transfer_account_id?: string;
  transfer_account_name?: string;
  transfer_transaction_id?: string;
};

export type Category = {
  id: string;
  category_group_id: string;
  category_group_name?: string;
  name: string;
  hidden: boolean;
  note?: string;
  goal_type?: "TB" | "TBD" | "MF" | "NEED" | string | null;
  goal_creation_month?: string;
  goal_target: number;
  goal_target_month?: string;
  budgeted: number;
  activity: number;
  balance: number;
};

export type Payee = {
  id: string;
  name: string;
  transfer_account_id?: string | null;
};

// export type Month = {
//   month: string;
//   note?: string | null;
//   income: number;
//   budgeted: number;
//   activity: number;
//   to_be_budgeted: number;
//   over_budget: number;
//   scheduled: number;
// };

export type Account = {
  id: string;
  name: string;
  type: string;
  on_budget: boolean;
  closed: boolean;
  note?: string | null;
  balance: number;
  transfer_payee_id: string;
};
