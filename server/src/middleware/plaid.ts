import plaid from "plaid";

let client: plaid.Client;
export default {
  init: (plaidConfigString: string): void => {
    const {
      PLAID_CLIENT_ID,
      PLAID_SECRET,
      PLAID_PUBLIC_KEY,
      PLAID_ENV,
    } = JSON.parse(plaidConfigString);

    client = new plaid.Client(
      PLAID_CLIENT_ID,
      PLAID_SECRET,
      PLAID_PUBLIC_KEY,
      plaid.environments[PLAID_ENV],
      { version: "2019-05-29", clientApp: "Quota" }
    );
  },
  getPlaidClient: (): plaid.Client => {
    if (!client) throw new Error("Plaid client not found.");
    return client;
  },
};
