import {
  Account,
  AccountsResponse,
  GetInstitutionByIdResponse,
  Institution,
  TokenResponse,
  TransactionsResponse,
} from "plaid";
import plaid from "../../../middleware/plaid";

export const exchangePlaidPublicToken = (
  publicToken: string
): Promise<TokenResponse> =>
  plaid.getPlaidClient().exchangePublicToken(publicToken);

export const getPlaidCategories = () => plaid.getPlaidClient().getCategories();

export const getPlaidTransactions = (
  accessToken: string,
  startDate: string,
  endDate = new Date().toISOString().slice(0, 10)
): Promise<TransactionsResponse> =>
  plaid.getPlaidClient().getTransactions(accessToken, startDate, endDate);

export const getPlaidAccounts = (
  accessToken: string
): Promise<AccountsResponse> => plaid.getPlaidClient().getAccounts(accessToken);

export const getPlaidInstitution = (
  institutionId: string
): Promise<GetInstitutionByIdResponse<Institution>> =>
  plaid.getPlaidClient().getInstitutionById(institutionId);

export default plaid;

export const exchangePlaidPublicTokenForItem = async (
  publicToken: string
): Promise<{
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName: string;
  accounts: Account[];
}> => {
  const {
    access_token: accessToken,
    item_id: itemId,
  } = await exchangePlaidPublicToken(publicToken);

  const {
    item: { institution_id: institutionId },
    accounts,
  } = await getPlaidAccounts(accessToken);

  const {
    institution: { name: institutionName },
  } = await getPlaidInstitution(institutionId);

  return {
    accessToken,
    itemId,
    institutionId,
    institutionName,
    accounts,
  };
};
