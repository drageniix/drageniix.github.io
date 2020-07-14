import React, { useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

const { PLAID_PUBLIC_KEY, PLAID_ENV } = JSON.parse(process.env.PLAID_CONFIG);
let attempt = Math.random();

const PlaidLink = () => {
  const config = {
    clientName: "Quota",
    env: PLAID_ENV,
    product: ["transactions"],
    publicKey: PLAID_PUBLIC_KEY,
    onSuccess: useCallback(onPlaidSuccess, []),
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={(): void => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

const onPlaidSuccess = (token: any, metadata: any) => {
  attempt++;
  console.log(attempt);
  fetch("http://localhost:5001/v1/quota/user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Ashley " + attempt,
      email: "admin@test.com" + attempt,
      password: "admin",
    }),
  })
    .then((res) => res.json())
    .then(({ token: jwtToken }) =>
      fetch("http://localhost:5001/v1/quota/institution", {
        method: "POST",
        headers: {
          Authorization: `Bearer: ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
    );
};

export default PlaidLink;
