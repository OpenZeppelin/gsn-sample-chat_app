import React, { Component } from "react";

export default class RelayContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, relayBalance: null };
    this.setProvider = this.props.setProvider;
    this.subscription = null;
    this.web3 = this.props.web3;
    this.instance = this.props.instance;
    this.relayHubInstance = this.props.relayHubInstance;
  }

  componentDidMount = async () => {
    let relayBalance = 0;

    if (this.instance) {
      console.log("This instance: ", this.instance)
      try {
        relayBalance = await this.instance.methods.getRecipientBalance().call();
        relayBalance = this.web3.utils.fromWei(relayBalance, "ether");
      } catch (errors) {
        console.error(errors)
      }
      this.setState({ relayBalance });
    }

    const newBlocks = this.web3.eth.subscribe("newBlockHeaders");
    newBlocks.on("data", this.getRelayBalance);

    this.subscription = newBlocks;
  };

  componentWillUnmount = async () => {
    if (this.subscription) {
      this.subscription.unSubscribe();
    }
  };

  render() {
    return <div>Dapp Balance in Relay Hub: {this.state.relayBalance} Eth</div>;
  }
}
