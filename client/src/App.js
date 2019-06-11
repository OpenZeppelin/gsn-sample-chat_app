import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, useRelayer, useEphermeralRelay } from "./utils/getWeb3";
import { Loader } from 'rimble-ui';

import ChatContainer from './components/Chatcontainer/index';
import styles from './App.module.scss';
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';

console.log("React VErsion: ", React.version);
class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    route: window.location.pathname.replace("/","")
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  }

  componentDidMount = async () => {
    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
    let ChatApp = {};
    try {
      ChatApp = require("../../contracts/ChatApp.sol");
      //console.log("Chat app: ", ChatApp);
    } catch (e) {
      console.log(e);
    }

    try {
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        let ganacheAccounts = [];
        try {
          ganacheAccounts = await this.getGanacheAddresses();
        } catch (e) {
          console.log('Ganache is not running');
        }
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();
        const isMetaMask = web3.currentProvider.isMetaMask;
        let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
        balance = web3.utils.fromWei(balance, 'ether');
        let instance = null;
        let deployedNetwork = null;
        //console.log("Chat App: ", ChatApp);
        if (ChatApp.networks) {
          deployedNetwork = ChatApp.networks[networkId.toString()];
          //console.log("Deployed Network: ", deployedNetwork);
          if (deployedNetwork) {
            instance = new web3.eth.Contract(
              ChatApp.abi,
              deployedNetwork && deployedNetwork.address,
            );
          }
        }

        this.setState({ web3, ganacheAccounts, accounts, balance, networkId, isMetaMask, instance, networkType, ChatApp });
        //useRelayer(this.state.web3);
        useEphermeralRelay(this.state.web3);
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  render() {
    if (!this.state.web3) {
      return this.renderLoader();
    }
    return (
      <div className={styles.App}>
        <h1>GSN Chat APP</h1>
        <p></p>
        <ChatContainer {...this.state}/>
      </div>
    );
  }
}

export default App;
