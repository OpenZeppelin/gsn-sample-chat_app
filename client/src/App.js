import React, { Component } from "react";
import getWeb3, {
  getGanacheWeb3,
  useRelayer,
  useEphermeralRelay,
  useInjectedWeb3
} from "./utils/getWeb3";
import { Loader } from "rimble-ui";
import RelayContainer from "./components/RelayContainer";

import ChatContainer from "./components/Chatcontainer/index";
import styles from "./App.module.scss";

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      signingAccount: null,
      celebration: false,
      storageValue: 0,
      web3: null,
      ganacheWeb3: null,
      accounts: null,
      route: window.location.pathname.replace("/", ""),
      metaTxSigner: "MetaMask",
      setProvider: null,
      fetching: false,
      setFetchStatus: null
    };

    this.setMetaTxSigner = this.setMetaTxSigner.bind(this);
    this.setFetchStatus = this.setFetchStatus.bind(this);
  }

  setFetchStatus = status => {
    this.setState({ fetching: status });
  };

  setMetaTxSigner = async signer => {
    let signingAccount;
    switch (signer) {
      case "MetaMask":
        await useInjectedWeb3(this.state.web3);
        signingAccount = this.state.accounts[0];
        this.setState({});
        console.log("Using regular transaction flow");
        this.setState({ signingAccount });
        break;
      case "MMSigner":
        await useRelayer(this.state.web3);
        signingAccount = this.state.accounts[0];
        console.log("Using Metamask to sign");
        this.setState({ signingAccount });
        break;
      case "Ephemeral":
        signingAccount = await useEphermeralRelay(this.state.web3);
        console.log("Using Ephemeral KeyPair: ", signingAccount);
        this.setState({ signingAccount, celebration: true });
        break;
      default:
        await getWeb3();
    }
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }

    return [];
  };

  componentDidMount = async () => {
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
        const ganacheAccounts = await this.getGanacheAddresses();
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

        this.setState({
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
          setProvider: this.setMetaTxSigner,
          setFetchStatus: this.setFetchStatus,
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
        <p> Unlock your metamask, or check to be sure it's connected to the right network. </p>
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
        <p />
        <ChatContainer {...this.state} {...this.setMetaTxSigner} />
        <RelayContainer {...this.state} />
      </div>
    );
  }
}

export default App;
