import React, { useEffect, useState } from "react";
import {
  useRelayer,
  useEphermeralRelay,
  useInjectedWeb3
} from "./utils/getWeb3";
import { Loader } from "rimble-ui";
import RelayContainer from "./components/RelayContainer";
//import { isMobile } from "react-device-detect";

import ChatContainer from "./components/Chatcontainer/index";
import styles from "./App.module.scss";
import { useWeb3Injected, useWeb3Network, fromInjected } from "@openzeppelin/network";

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
    ganacheProvider: null
  };

  const [appState, setAppState] = useState(initialAppState);

  let web3Context = useWeb3Injected();
  let localContext = useWeb3Network("http://127.0.0.1:8545");


  useEffect(() => {
    console.log("Web3Context: ", web3Context);
    const load = async () => {
      await web3Context.requestAuth();
      
      console.log("Here")
      const { accounts, networkId, networkName, providerName } = web3Context;
      const { ganacheAccounts } = localContext;
      
      let ChatApp = {};
      try {
        ChatApp = require("../../contracts/ChatApp.sol");
      } catch (e) {
        console.log(e);
      }

      try {
        const isProd = process.env.NODE_ENV === "production";
        if (!isProd && web3Context) {
          const web3 = web3Context.lib;

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
            signingAccount: accounts[0],
            accounts,
            balance,
            networkId,
            isMetaMask: providerName == "metamask",
            instance,
            networkName,
            ChatApp,
            setProvider: setMetaTxSigner,
            setFetchStatus: setFetchStatus,
            ganacheWeb3: localContext.lib,
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

    if(web3Context){
      load();
    }
    
  }, [web3Context]);

  const setFetchStatus = status => {
    setAppState({ fetching: status });
  };

  const setMetaTxSigner = async signer => {
    const { accounts, networkId, networkName, providerName, lib } = web3Context;
    let signingAccount;
    switch (signer) {
      case "MetaMask":
        await useInjectedWeb3(appState.web3);
        signingAccount = accounts[0];
        console.log("Using regular transaction flow");
        setAppState({
          signingAccount,
          metaTxSigner: "MetaMask Signing + Sending"
        });
        break;
      case "MMSigner":
        await useRelayer(appState.web3);
        signingAccount = accounts[0];
        console.log("Using Metamask to sign");
        setAppState({
          signingAccount,
          metaTxSigner: "MetaMask KeyPair + Relayer"
        });
        break;
      case "Ephemeral":
        console.log("The appstate web3: ", appState.web3)
        signingAccount = await useEphermeralRelay(appState.web3);
        console.log("Using Ephemeral KeyPair: ", signingAccount);
        setAppState({
          signingAccount,
          metaTxSigner: "Ephemeral KeyPair + Relayer"
        });
        break;
      default:
        web3Context = useWeb3Injected();

    }
  };




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
