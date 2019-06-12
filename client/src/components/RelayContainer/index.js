import React, { Component } from "react";
import { Form, Button } from "rimble-ui";
import styles from "./RelayContainer.module.scss";

export default class RelayContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, relayBalance: null, relayInstance: null };
    this.setProvider = this.props.setProvider;
    this.subscription = null;
  }

  componentDidMount = async () => {
    const { web3 } = this.props;

    let relayInstance = {};
    let relayHub = {};
    try {
      relayHub = require("../../../../build/contracts/RelayHub.json");
    } catch (error) {
      console.log(error);
    }

    if (web3) {
      const networkId = await web3.eth.net.getId();
      const networkType = await web3.eth.net.getNetworkType();
      relayInstance = new web3.eth.Contract(
        relayHub.abi,
        "0x9C57C0F1965D225951FE1B2618C92Eefd687654F"
      );
      this.setState({ relayInstance });
    }

    const newBlocks = web3.eth.subscribe("newBlockHeaders");
    newBlocks.on("data", this.getRelayBalance);

    this.subscription = newBlocks;
    this.getRelayBalance();
  };

  componentWillUnmount = async () => {
    if (this.subscription) {
      this.subscription.unSubscribe();
    }
  };

  getRelayBalance = async () => {
    const { web3, chatAppAddress } = this.props;
    const { relayInstance } = this.state;
    try {
      let balance = await relayInstance.methods
        .balanceOf(chatAppAddress)
        .call();
      balance = web3.utils.fromWei(balance, "ether");
      this.setState({ relayBalance: balance });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return <div>Relay Balance: {this.state.relayBalance} Eth</div>;
  }
}
