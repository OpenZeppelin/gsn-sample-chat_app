import React, { useState, useEffect } from "react";
import {
  useWeb3Injected,
  useEphemeralKey,
  useWeb3Network
} from "@openzeppelin/network";

import { Loader } from "rimble-ui";

import ChatContainer from "./components/Chatcontainer/index";
import styles from "./App.module.scss";
import logo from "../src/images/OZ_logo.png";

let ChatApp = require("../../build/contracts/ChatApp.json");

const App = () => {
  const prod = false;
  const signKey = useEphemeralKey();

  const gasPrice = 22000000001;
  let relay_client_config = {
    txfee: process.env.REACT_APP_TX_FEE || 90,
    force_gasPrice: gasPrice, //override requested gas price
    gasPrice: gasPrice, //override requested gas price
    force_gasLimit: 500000, //override requested gas limit.
    gasLimit: 500000, //override requested gas limit.
    verbose: true
  };

  let web3Context = null; //

  if (window.ethereum) {
    web3Context = useWeb3Injected({
      gsn: { signKey, ...relay_client_config }
    });
  } else {
    if (prod) {
      web3Context = useWeb3Network(
        "https://rinkeby.infura.io/v3/d6760e62b67f4937ba1ea2691046f06d",
        {
          gsn: { signKey, ...relay_client_config }
        }
      );
    } else {
      web3Context = useWeb3Network("http://127.0.0.1:8545", {
        gsn: { signKey, ...relay_client_config }
      });
    }
  }

  const defaultState = {
    web3Context: web3Context,
    chatAppInstance: null,
    appReady: false,
    signKey: signKey
  };

  const [state, setState] = useState(defaultState);
  const [fetchState, setFetchState] = useState({ fetching: false });

  const setFetching = value => {
    setFetchState({ fetching: value });
  };

  useEffect(() => {
    const { lib, networkId } = web3Context;
    const load = async () => {
      let chatAppInstance = {};
      let chatAppAddress = null;
      let deployedNetwork = null;

      if (process.env.REACT_APP_CHAT_APP_ADDRESS) {
        chatAppAddress = process.env.REACT_APP_CHAT_APP_ADDRESS;
      } else if (ChatApp.networks) {
        deployedNetwork = ChatApp.networks[networkId.toString()];
        if (deployedNetwork) {
          chatAppAddress = deployedNetwork && deployedNetwork.address;
        }
      }

      if (chatAppAddress) {
        chatAppInstance = new lib.eth.Contract(ChatApp.abi, chatAppAddress);
      } else {
        console.error("Chat app address not found");
      }
      setState({ ...state, chatAppInstance, appReady: true, signKey });
      setFetchState({ fetching: false });
    };

    if (web3Context.connected) {
      load();
    }
  }, [web3Context.connected]);

  const renderLoader = () => {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, GSN Relay and contract...</h3>
      </div>
    );
  };

  const renderApp = () => {
    return (
      <div className={styles.App}>
        <div>
          <img className={styles.logo} src={logo} alt="Logo" />
        </div>
        <h1>GSN Chat APP</h1>
        <ChatContainer
          {...state}
          fetchState={fetchState}
          setFetchState={setFetching}
        />
      </div>
    );
  };

  if (!state.appReady) {
    return renderLoader();
  } else {
    return renderApp();
  }
};

export default App;
