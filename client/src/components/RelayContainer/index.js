import React, { useState, useEffect } from "react";

const RelayContainer = props => {
  const { web3, instance } = props;
  const defaultState = { validated: false, dappBalance: null };

  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let subscription = null;

    const getDappBalance = async instance => {
      let dappBalance = null;
      if (instance) {
        try {
          dappBalance = await instance.methods.getRecipientBalance().call();
          dappBalance = web3.utils.fromWei(dappBalance, "ether");
        } catch (errors) {
          console.error(errors);
        }
        setState({ dappBalance });
      }
    };

    const load = async () => {
      getDappBalance(instance);

      const newBlocks = web3.eth.subscribe("newBlockHeaders");
      newBlocks.on("data", getDappBalance());
      subscription = newBlocks;
    };

    load();
    if (subscription) {
      return () => {
        subscription.unSubscribe();
      };
    }
  }, [instance]);

  if (state.dappBalance) {
    return <div>App balance for gasless txs: {state.dappBalance} Eth</div>;
  } else {
    return <div>App balance not loaded.</div>;
  }
};

export default RelayContainer;
