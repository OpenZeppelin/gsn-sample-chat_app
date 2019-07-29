import React, { Component } from "react";
import { getDappBalance } from "../../utils/getWeb3";
const relayHubAddress = process.env.REACT_APP_HUB_ADDRESS || "0x254dffcd3277c0b1660f6d42efbb754edababc2b";

export default class RelayContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, relayBalance: null, relayInstance: null };
    this.setProvider = this.props.setProvider;
    this.subscription = null;
  }

  componentDidMount = async () => {
    const { web3, instance } = this.props;

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
      this.setState({ relayInstance, relayBalance: balance });
    }

    const newBlocks = web3.eth.subscribe("newBlockHeaders");
    newBlocks.on("data", this.getRelayBalance);

    this.subscription = newBlocks;
  };

  componentWillUnmount = async () => {
    if (this.subscription) {
      this.subscription.unSubscribe();
    }
  };

  render() {
    return <div>Relay Balance: {this.state.relayBalance} Eth</div>;
  }
}
