import React, { Component } from "react";
import getWeb3, {
  getGanacheWeb3,
  useRelayer,
  useEphermeralRelay,
  useInjectedWeb3,
  getInfuraWeb3,
} from "./utils/getWeb3";
import { Loader } from "rimble-ui";
import RelayContainer from "./components/RelayContainer";
import ChatContainer from "./components/Chatcontainer/index";
import styles from "./App.module.scss";
import logo from '../src/images/OZ_logo.png';
import {
  isMobile
} from "react-device-detect";
// const relayHubAddress =
//   process.env.REACT_APP_HUB_ADDRESS ||
//   "0x254dffcd3277c0b1660f6d42efbb754edababc2b";

const relayHubAddress = "0x9C57C0F1965D225951FE1B2618C92Eefd687654F";


class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      signingAccount: null,
      storageValue: 0,
      web3: null,
      ganacheWeb3: null,
      accounts: null,
      route: window.location.pathname.replace("/", ""),
      metaTxSigner: "MetaMask Signing + Sending",
      isMetaMask: false,
      setProvider: null,
      fetching: false,
      setFetchStatus: null,
      relayHubInstance: null,
      instance: null, 
      ganacheProvider: null,
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
        this.setState({
          signingAccount,
          metaTxSigner: "MetaMask Signing + Sending"
        });
        break;
      case "MMSigner":
        await useRelayer(this.state.web3);
        signingAccount = this.state.accounts[0];
        console.log("Using Metamask to sign");
        this.setState({
          signingAccount,
          metaTxSigner: "MetaMask KeyPair + Relayer"
        });
        break;
      case "Ephemeral":
        signingAccount = await useEphermeralRelay(this.state.web3);
        console.log("Using Ephemeral KeyPair: ", signingAccount);
        this.setState({
          signingAccount,
          metaTxSigner: "Ephemeral KeyPair + Relayer"
        });
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
    const RelayHubAbi = [
      {
        constant: false,
        inputs: [
          { name: "transactionFee", type: "uint256" },
          { name: "url", type: "string" }
        ],
        name: "registerRelay",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          { name: "relay", type: "address" },
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "encodedFunction", type: "bytes" },
          { name: "transactionFee", type: "uint256" },
          { name: "gasPrice", type: "uint256" },
          { name: "gasLimit", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "signature", type: "bytes" },
          { name: "approvalData", type: "bytes" }
        ],
        name: "canRelay",
        outputs: [
          { name: "status", type: "uint256" },
          { name: "recipientContext", type: "bytes" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "from", type: "address" }],
        name: "getNonce",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "amount", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "unsignedTx", type: "bytes" },
          { name: "signature", type: "bytes" }
        ],
        name: "penalizeIllegalTransaction",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "encodedFunction", type: "bytes" },
          { name: "transactionFee", type: "uint256" },
          { name: "gasPrice", type: "uint256" },
          { name: "gasLimit", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "signature", type: "bytes" },
          { name: "approvalData", type: "bytes" }
        ],
        name: "relayCall",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "relayedCallStipend", type: "uint256" }],
        name: "requiredGas",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "target", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "relay", type: "address" }],
        name: "getRelay",
        outputs: [
          { name: "totalStake", type: "uint256" },
          { name: "unstakeDelay", type: "uint256" },
          { name: "unstakeTime", type: "uint256" },
          { name: "owner", type: "address" },
          { name: "state", type: "uint8" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          { name: "relayedCallStipend", type: "uint256" },
          { name: "gasPrice", type: "uint256" },
          { name: "transactionFee", type: "uint256" }
        ],
        name: "maxPossibleCharge",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "unsignedTx1", type: "bytes" },
          { name: "signature1", type: "bytes" },
          { name: "unsignedTx2", type: "bytes" },
          { name: "signature2", type: "bytes" }
        ],
        name: "penalizeRepeatedNonce",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "target", type: "address" }],
        name: "depositFor",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "relayaddr", type: "address" },
          { name: "unstakeDelay", type: "uint256" }
        ],
        name: "stake",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "relay", type: "address" }],
        name: "removeRelayByOwner",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "relay", type: "address" }],
        name: "unstake",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "relay", type: "address" },
          { indexed: false, name: "stake", type: "uint256" },
          { indexed: false, name: "unstakeDelay", type: "uint256" }
        ],
        name: "Staked",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "relay", type: "address" },
          { indexed: true, name: "owner", type: "address" },
          { indexed: false, name: "transactionFee", type: "uint256" },
          { indexed: false, name: "stake", type: "uint256" },
          { indexed: false, name: "unstakeDelay", type: "uint256" },
          { indexed: false, name: "url", type: "string" }
        ],
        name: "RelayAdded",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "relay", type: "address" },
          { indexed: false, name: "unstakeTime", type: "uint256" }
        ],
        name: "RelayRemoved",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "relay", type: "address" },
          { indexed: false, name: "stake", type: "uint256" }
        ],
        name: "Unstaked",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "recipient", type: "address" },
          { indexed: true, name: "from", type: "address" },
          { indexed: false, name: "amount", type: "uint256" }
        ],
        name: "Deposited",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "dest", type: "address" },
          { indexed: false, name: "amount", type: "uint256" }
        ],
        name: "Withdrawn",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "relay", type: "address" },
          { indexed: true, name: "from", type: "address" },
          { indexed: true, name: "to", type: "address" },
          { indexed: false, name: "selector", type: "bytes4" },
          { indexed: false, name: "reason", type: "uint256" }
        ],
        name: "CanRelayFailed",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "relay", type: "address" },
          { indexed: true, name: "from", type: "address" },
          { indexed: true, name: "to", type: "address" },
          { indexed: false, name: "selector", type: "bytes4" },
          { indexed: false, name: "status", type: "uint8" },
          { indexed: false, name: "charge", type: "uint256" }
        ],
        name: "TransactionRelayed",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "relay", type: "address" },
          { indexed: false, name: "sender", type: "address" },
          { indexed: false, name: "amount", type: "uint256" }
        ],
        name: "Penalized",
        type: "event"
      }
    ];
    let ChatApp = {};
    try {
      ChatApp = require("../../build/contracts/ChatApp.json");
    } catch (e) {
      console.error(e);
    }

    try {

      let web3;
      if(isMobile){
        web3 = await getInfuraWeb3();
        console.log("On Mobile, Not loading MetaMask")
      } else {
        web3 = await getWeb3();
        console.log("On Desktop, Trying to Load MetaMask");
      }
     

      const ganacheWeb3 = await getGanacheWeb3();
      const ganacheAccounts = await this.getGanacheAddresses();
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

      let chatAppAddress = null;

      if (process.env.REACT_APP_CHAT_APP_ADDRESS) {
        chatAppAddress = process.env.REACT_APP_CHAT_APP_ADDRESS;
      } else if (ChatApp.networks) {
        deployedNetwork = ChatApp.networks[networkId.toString()];
        if (deployedNetwork) {
          chatAppAddress = deployedNetwork && deployedNetwork.address;
        }
      }

      if (chatAppAddress) {
        instance = new web3.eth.Contract(ChatApp.abi, chatAppAddress);
      } else {
        console.error("Chat app address not found");
      }

      let relayHubInstance = null;
      try {
        relayHubInstance = await new web3.eth.Contract(
          RelayHubAbi,
          relayHubAddress
        );
      } catch (error) {
        console.error(error);
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
        chatAppAddress,
        relayHubInstance
      });
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
        <p>
          {" "}
          Unlock your metamask, or check to be sure it's connected to the right
          network.{" "}
        </p>
      </div>
    );
  }

  render() {
    if (!this.state.instance) {
      return this.renderLoader();
    }
    return (
      <div className={styles.App}>
        <div><img src={logo} alt="Logo" /></div>
        <h1>GSN Chat APP</h1>
        <p />
        <ChatContainer {...this.state} {...this.setMetaTxSigner} />
        <RelayContainer {...this.state} />
      </div>
    );
  }
}

export default App;
