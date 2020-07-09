import plaid from "../../../middleware/plaid";

export const exchangePlaidPublicToken = (publicToken: string) =>
  plaid.getPlaidClient().exchangePublicToken(publicToken);

export const getPlaidCategories = () => plaid.getPlaidClient().getCategories();

export const getPlaidTransactions = (
  accessToken: string,
  startDate: string,
  endDate = new Date().toISOString().slice(0, 10)
) => plaid.getPlaidClient().getTransactions(accessToken, startDate, endDate);

export const getPlaidAccounts = (accessToken: string) =>
  plaid.getPlaidClient().getAccounts(accessToken);

export const getPlaidInstitution = (institutionId: string) =>
  plaid.getPlaidClient().getInstitutionById(institutionId);

export default plaid;

export const exchangePlaidPublicTokenForItem = async (publicToken: string) => {
  const { access_token, item_id } = await exchangePlaidPublicToken(publicToken);

  const {
    item: { institution_id },
    accounts,
  } = await getPlaidAccounts(access_token);

  const {
    institution: { name: institution_name },
  } = await getPlaidInstitution(institution_id);

  return {
    access_token,
    item_id,
    institution_id,
    institution_name,
    accounts,
  };
};
