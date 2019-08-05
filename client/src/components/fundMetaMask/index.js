import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";]

const NODE_ENV = process.env.NODE_ENV || "development";

const FundMetaMask = props => {
  const { web3, accounts, ganacheAccounts, ganacheWeb3 } = props;
  const defaultState = { balance: null };
  const [state, setState] = useState(defaultState);

  let poll = null;

  useEffect(() => {
    poll = setInterval(() => getBalance(), 1000);

    return () => {
      clearInterval(poll);
    };
  }, []);

  const getBalance = async () => {
    let balance;

    if (web3) {
      try {
        balance = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        setState({ balance });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fund = async () => {
    const tx = await ganacheWeb3.eth.sendTransaction({
      from: ganacheAccounts[0],
      to: accounts[0],
      value: 2e18
    });
    if (tx) {
      getBalance();
    }
  };

  if (NODE_ENV === "production") return null;
  if (!props.ganacheWeb3) return null;
  return (
    <div>
      <Button size="small" onClick={() => fund()}>
        Fund Meta Mask: (balance: {state.balance})
      </Button>
    </div>
  );
};

export default FundMetaMask;