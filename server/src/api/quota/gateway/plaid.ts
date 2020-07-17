import {
  Account,
  AccountsResponse,
  CategoriesResponse,
  GetInstitutionByIdResponse,
  Institution,
  ItemResponse,
  TokenResponse,
  TransactionsResponse,
} from "plaid";
import plaid from "../../../middleware/plaid";

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

export * from "../../../middleware/plaid";
