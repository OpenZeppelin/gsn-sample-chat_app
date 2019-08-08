import React, { useState, useEffect } from "react";
import {
  useEphemeralKey,
  useWeb3Network
} from "@openzeppelin/network";

import { Loader } from "rimble-ui";
import ChatContainer from "./components/Chatcontainer/index";
import styles from "./App.module.scss";
import logo from "../src/images/OZ_logo.png";

const REACT_APP_TX_FEE = process.env.REACT_APP_TX_FEE || 90;
const REACT_APP_CHAT_APP_ADDRESS =
  process.env.REACT_APP_CHAT_APP_ADDRESS || null;
//const NODE_ENV = process.env.NODE_ENV || "development";
const NODE_ENV = "development";



let ChatApp = require("../../build/contracts/ChatApp.json");

const App = () => {
  const signKey = useEphemeralKey();
  const gasPrice = 22000000001;
  let relay_client_config = {
    txfee: REACT_APP_TX_FEE,
    force_gasPrice: gasPrice, //override requested gas price
    gasPrice: gasPrice, //override requested gas price
    force_gasLimit: 500000, //override requested gas limit.
    gasLimit: 500000, //override requested gas limit.
    verbose: true
  };

  const [fetchState, setFetchState] = useState({
    fetching: false,
    error: false
  });

  const setFetching = value => {
    setFetchState({ fetching: value });
  };

  let web3Context = null;


  if (NODE_ENV === "development") {
    try {
      web3Context = useWeb3Network("ws://127.0.0.1:8545", {
        gsn: { signKey, ...relay_client_config }
      });
    } catch (error) {
      console.log(error);
      setFetchState({ fetching: false, error });
    }
  } else {
    try {
      web3Context = useWeb3Network(
        "wss://rinkeby.infura.io/ws/v3/d6760e62b67f4937ba1ea2691046f06d",
        {
          gsn: { signKey, ...relay_client_config }
        }
      );
    } catch (error) {
      console.log(error);
      setFetchState({ fetching: false, error });
    }
  }

  const defaultState = {
    web3Context: web3Context,
    ChatAppAbi: null,
    chatAppInstance: null,
    infuraAppInstance: null,
    appReady: false,
    signKey: signKey
  };

  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const { lib, networkId } = web3Context;
    const load = async () => {
      let chatAppInstance = null;
      let chatAppAddress = null;
      let deployedNetwork = null;

      if (REACT_APP_CHAT_APP_ADDRESS && NODE_ENV !== "development") {
        chatAppAddress = REACT_APP_CHAT_APP_ADDRESS;
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

      setState({
        ...state,
        chatAppInstance,
        ChatAppAbi: ChatApp,
        appReady: true,
        signKey
      });
      setFetchState({ fetching: false });
    };

    if (web3Context.connected) {
      load();
    }
  }, [web3Context.connected]);

  const renderLoader = () => {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="blue" />
        <h3> Loading Web3, accounts, GSN Relay and contract...</h3>
        {web3Context.networkName !== "Rinkeby" && web3Context.connected ? (
          <div>
            Your network is: {web3Context.networkName}, and are in Development
            mode.
          </div>
        ) : null}
        {web3Context.networkName === "Private" &&
        state.chatAppInstance === {} ? (
          <div>Please check that the contracts are deployed.</div>
        ) : null}
      </div>
    );
  };

  const renderApp = () => {
    const setContext = provider => {
      setState({ ...state, web3Context: provider });
    };
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
          setContext={setContext}
        />
      </div>
    );
  };

  if (!state.chatAppInstance) {
    return renderLoader();
  } else {
    return renderApp();
  }
};

export default App;
