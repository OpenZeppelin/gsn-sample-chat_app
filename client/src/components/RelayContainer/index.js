import React, { useState, useEffect } from "react";

const RelayContainer = props => {
  const { web3Context, chatAppInstance } = props;
  const { lib } = web3Context;

  const defaultState = { validated: false, dappBalance: null };

  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let subscription = null;

    const getDappBalance = async () => {
      let dappBalance = null;
      if (chatAppInstance) {
        try {
          dappBalance = await chatAppInstance.methods
            .getRecipientBalance()
            .call();
          dappBalance = lib.utils.fromWei(dappBalance, "ether");
        } catch (errors) {
          console.error(errors);
        }
        setState({ dappBalance });
      }
    };

    const load = async () => {
      getDappBalance(chatAppInstance);

      const newBlocks = lib.eth.subscribe("newBlockHeaders");
      newBlocks.on("data", getDappBalance);
      subscription = newBlocks;
    };
    if (chatAppInstance) load();

    if (subscription) {
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  if (state.dappBalance) {
    return <div>App balance for gasless txs: {state.dappBalance} Eth</div>;
  } else {
    return <div>App balance not loaded.</div>;
  }
};

export default RelayContainer;
