import plaid from "../../../middleware/plaid";

export const exchangePublicToken = (publicToken: string) =>
  plaid.getPlaidClient().exchangePublicToken(publicToken);

export const getTransactions = (
  accessToken: string,
  startDate = "2020-06-01",
  endDate = "2020-07-01"
) => plaid.getPlaidClient().getTransactions(accessToken, startDate, endDate);

export const getInstitution = (institutionId: string) =>
  plaid.getPlaidClient().getInstitutionById(institutionId);

export default plaid;

export const exchangePublicTokenForItem = async (publicToken: string) => {
  const { access_token, item_id } = await exchangePublicToken(publicToken);

  const {
    item: { institution_id },
    accounts,
    transactions,
  } = await getTransactions(access_token);

  const {
    institution: { name: institution_name },
  } = await getInstitution(institution_id);

  return {
    access_token,
    item_id,
    institution_id,
    institution_name,
    accounts,
    transactions,
  };
};
