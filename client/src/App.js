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

const relayHubAddress = "0x9C57C0F1965D225951FE1B2618C92Eefd687654F";

let ChatApp = require("../../build/contracts/ChatApp.json");

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
          <img src={logo} alt="Logo" />
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
