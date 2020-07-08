import React, { useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

const { PLAID_PUBLIC_KEY, PLAID_ENV } = JSON.parse(process.env.PLAID_CONFIG);

const PlaidLink = () => {
  const onSuccess = useCallback((token, metadata) => {
    console.log(token, metadata);
  }, []);

  const config = {
    clientName: "Quota",
    env: PLAID_ENV,
    product: ["transactions"],
    publicKey: PLAID_PUBLIC_KEY,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={(): void => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};
export default PlaidLink;
