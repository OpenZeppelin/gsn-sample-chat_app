import React, { Component, useEffect, useState } from "react";
import getWeb3, {
  getGanacheWeb3,
  useRelayer,
  useEphermeralRelay,
  useInjectedWeb3
} from "./utils/getWeb3";
import { Loader } from "rimble-ui";
import RelayContainer from "./components/RelayContainer";
import { isMobile } from "react-device-detect";

import ChatContainer from "./components/Chatcontainer/index";
import styles from "./App.module.scss";
import { useWeb3Injected, useWeb3Network } from "@openzeppelin/network";

const App = (props, context) => {
  const initialAppState = {
    signingAccount: null,
    storageValue: 0,
    web3: null,
    ganacheWeb3: null,
    accounts: null,
    route: window.location.pathname.replace("/", ""),
    metaTxSigner: "MetaMask Signing + Sending",
    setProvider: null,
    fetching: false,
    setFetchStatus: null, 
    ganacheProvider: null,
  };

  const [appState, setAppState] = useState(initialAppState);

  const setFetchStatus = status => {
    setAppState({ fetching: status });
  };

  const setMetaTxSigner = async signer => {
    let signingAccount;
    switch (signer) {
      case "MetaMask":
        await useInjectedWeb3(this.state.web3);
        signingAccount = this.state.accounts[0];
        setAppState({});
        console.log("Using regular transaction flow");
        setAppState({
          signingAccount,
          metaTxSigner: "MetaMask Signing + Sending"
        });
        break;
      case "MMSigner":
        await useRelayer(this.state.web3);
        signingAccount = this.state.accounts[0];
        console.log("Using Metamask to sign");
        setAppState({
          signingAccount,
          metaTxSigner: "MetaMask KeyPair + Relayer"
        });
        break;
      case "Ephemeral":
        signingAccount = await useEphermeralRelay(this.state.web3);
        console.log("Using Ephemeral KeyPair: ", signingAccount);
        setAppState({
          signingAccount,
          metaTxSigner: "Ephemeral KeyPair + Relayer"
        });
        break;
      default:
        await getWeb3();
    }
  };

  const getGanacheAddresses = async () => {
    if (!appState.ganacheProvider) {
      appState.ganacheProvider = getGanacheWeb3();
    }
    if (appState.ganacheProvider) {
      return await appState.ganacheProvider.eth.getAccounts();
    }

    return [];
  };

  useEffect(() => {
    const load = async () => {
      let ChatApp = {};
      try {
        ChatApp = require("../../contracts/ChatApp.sol");
      } catch (e) {
        console.log(e);
      }

      try {
        const isProd = process.env.NODE_ENV === "production";
        if (!isProd) {
          const web3 = await getWeb3();
          const ganacheAccounts = await getGanacheAddresses();
          const ganacheWeb3 = await getGanacheWeb3();
          const accounts = await web3.eth.getAccounts();
          const signingAccount = accounts[0];
          const networkId = await web3.eth.net.getId();
          const networkType = await web3.eth.net.getNetworkType();
          const isMetaMask = web3.currentProvider.isMetaMask;

          let balance =
            accounts.length > 0
              ? await web3.eth.getBalance(accounts[0])
              : web3.utils.toWei("0");

          balance = web3.utils.fromWei(balance, "ether");
          let instance = null;
          let deployedNetwork = null;

          if (ChatApp.networks) {
            deployedNetwork = ChatApp.networks[networkId.toString()];

            if (deployedNetwork) {
              instance = new web3.eth.Contract(
                ChatApp.abi,
                deployedNetwork && deployedNetwork.address
              );
            }
          }

          setAppState({
            web3,
            ganacheAccounts,
            signingAccount,
            accounts,
            balance,
            networkId,
            isMetaMask,
            instance,
            networkType,
            ChatApp,
            setProvider: setMetaTxSigner,
            setFetchStatus: setFetchStatus,
            ganacheWeb3,
            chatAppAddress: deployedNetwork.address
          });
        }
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    load();
  }, []);

  const renderLoader = () => {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p>
          {" "}
          Unlock your metamask, or check to be sure it's connected to the right
          network.{" "}
        </p>
      </div>
    );
  };

  if (!appState.web3) {
    return renderLoader();
  }
  return (
    <div className={styles.App}>
      <h1>GSN Chat APP</h1>
      <p />
      <ChatContainer {...appState} {...setMetaTxSigner} />
      <RelayContainer {...appState} />
    </div>
  );
};

export default App;
