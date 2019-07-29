import React, { useState, useEffect} from "react";
import { getDappBalance } from "../../utils/getWeb3";
const relayHubAddress = "0x9C57C0F1965D225951FE1B2618C92Eefd687654F";


const RelayContainer = (props) => {

  const defaultState = { validated: false, relayBalance: null, relayInstance: null };

  const [relayState, setRelayState] = useState(defaultState);

  const setProvider = props.setProvider;
  let subscription = null;


useEffect(()=> {
  const load = async () => {
    const { web3, instance } = props;

    let relayInstance = {};
    let relayHub = {};
    let balance = 0;

    try {
      relayHub = require("../../../../build/contracts/IRelayHub.json");
    } catch (error) {
      console.log(error);
    }

    if (web3) {
      relayInstance = await new web3.eth.Contract(
        relayHub.abi,
        relayHubAddress
      );

      balance = await getDappBalance(web3, instance);
      setRelayState({ relayInstance, relayBalance: balance });
    }

    const newBlocks = web3.eth.subscribe("newBlockHeaders");
    newBlocks.on("data", getDappBalance);

    subscription = newBlocks;
  };
  if (subscription) {
    return subscription.unSubscribe();
  }

  load();
}, [])
 




    return <div>Relay Balance: {relayState.relayBalance} Eth</div>;
  
}

export default RelayContainer;