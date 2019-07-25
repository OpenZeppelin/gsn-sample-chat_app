import React, { Component } from "react";
import { getRelayBalance, getDappBalance } from "../../utils/getWeb3";
const relayHubAddress = "0x9C57C0F1965D225951FE1B2618C92Eefd687654F";

export default class RelayContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, relayBalance: null, dappBalance: null, relayInstance: null };
    this.setProvider = this.props.setProvider;
    this.subscription = null;
  }

  componentDidMount = async () => {
    const { web3, chatAppAddress, instance } = this.props;
    console.log("The Props: ", this.props);

    let relayInstance = {};
    let relayHub = {};
    let relayBalance = null;
    let dappBalance = null;

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

      relayBalance = await getRelayBalance(web3, chatAppAddress, relayInstance);
      dappBalance = await getDappBalance(web3, instance);
      console.log("DappBalance: ", dappBalance);
      this.setState({ relayInstance, relayBalance, dappBalance });

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
