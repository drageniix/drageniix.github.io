import {
  Account,
  AccountsResponse,
  CategoriesResponse,
  Category,
  GetInstitutionByIdResponse,
  Institution,
  ItemResponse,
  TokenResponse,
  Transaction,
  TransactionLocation,
  TransactionPaymentMeta,
  TransactionsResponse,
} from "plaid";
import plaid from "../../../middleware/plaid";

export class PlaidTransaction implements Transaction {
  account_id: string;
  account_owner: string;
  amount: number;
  iso_currency_code: string;
  unofficial_currency_code: string;
  category: string[];
  category_id: string;
  date: string;
  authorized_date: string;
  location: TransactionLocation;
  name: string;
  payment_channel: string;
  payment_meta: TransactionPaymentMeta;
  pending: boolean;
  pending_transaction_id: string;
  transaction_id: string;
  transaction_type: string;
  transaction_code: string;
}

export class PlaidCategory implements Category {
  group: string;
  hierarchy: string[];
  category_id: string;
}

export class PlaidAccount implements Account {
  balances: {
    available: number;
    current: number;
    limit: number;
    iso_currency_code: string;
    unofficial_currency_code: string;
  };
  account_id: string;
  mask: string;
  name: string;
  official_name: string;
  subtype: string;
  type: string;
  verification_status:
    | "pending_automatic_verification"
    | "pending_manual_verification"
    | "manually_verified"
    | "automatically_verified";
}

export const exchangePlaidPublicToken = (
  publicToken: string
): Promise<TokenResponse> =>
  plaid.getPlaidClient().exchangePublicToken(publicToken);

export const getPlaidCategories = (): Promise<CategoriesResponse> =>
  plaid.getPlaidClient().getCategories();

export const getPlaidTransactions = (
  accessToken: string,
  startDate: string,
  endDate = new Date().toISOString().slice(0, 10)
): Promise<TransactionsResponse> =>
  plaid.getPlaidClient().getTransactions(accessToken, startDate, endDate);

export const getPlaidItem = (accessToken: string): Promise<ItemResponse> =>
  plaid.getPlaidClient().getItem(accessToken);

export const getPlaidAccounts = (
  accessToken: string
): Promise<AccountsResponse> => plaid.getPlaidClient().getAccounts(accessToken);

export const getPlaidInstitution = (
  institutionId: string
): Promise<GetInstitutionByIdResponse<Institution>> =>
  plaid.getPlaidClient().getInstitutionById(institutionId);

export const exchangePlaidAccessTokenForItem = async (
  accessToken: string
): Promise<{
  itemId: string;
  institutionId: string;
  institutionName: string;
  accounts: Account[];
}> => {
  const {
    item: { institution_id: institutionId, item_id: itemId },
    accounts,
  } = await getPlaidAccounts(accessToken);

  const {
    institution: { name: institutionName },
  } = await getPlaidInstitution(institutionId);

  return {
    itemId,
    institutionId,
    institutionName,
    accounts,
  };
};

export default plaid;
