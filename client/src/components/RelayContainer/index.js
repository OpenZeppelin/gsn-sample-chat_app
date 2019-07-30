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
    let balance = 0;

    if (web3) {
      const relayHubAbi = [{"constant":false,"inputs":[{"name":"transactionFee","type":"uint256"},{"name":"url","type":"string"}],"name":"registerRelay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"relay","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"encodedFunction","type":"bytes"},{"name":"transactionFee","type":"uint256"},{"name":"gasPrice","type":"uint256"},{"name":"gasLimit","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"signature","type":"bytes"},{"name":"approvalData","type":"bytes"}],"name":"canRelay","outputs":[{"name":"status","type":"uint256"},{"name":"recipientContext","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"}],"name":"getNonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"unsignedTx","type":"bytes"},{"name":"signature","type":"bytes"}],"name":"penalizeIllegalTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"encodedFunction","type":"bytes"},{"name":"transactionFee","type":"uint256"},{"name":"gasPrice","type":"uint256"},{"name":"gasLimit","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"signature","type":"bytes"},{"name":"approvalData","type":"bytes"}],"name":"relayCall","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"relayedCallStipend","type":"uint256"}],"name":"requiredGas","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"target","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"relay","type":"address"}],"name":"getRelay","outputs":[{"name":"totalStake","type":"uint256"},{"name":"unstakeDelay","type":"uint256"},{"name":"unstakeTime","type":"uint256"},{"name":"owner","type":"address"},{"name":"state","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"relayedCallStipend","type":"uint256"},{"name":"gasPrice","type":"uint256"},{"name":"transactionFee","type":"uint256"}],"name":"maxPossibleCharge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"unsignedTx1","type":"bytes"},{"name":"signature1","type":"bytes"},{"name":"unsignedTx2","type":"bytes"},{"name":"signature2","type":"bytes"}],"name":"penalizeRepeatedNonce","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"}],"name":"depositFor","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"relayaddr","type":"address"},{"name":"unstakeDelay","type":"uint256"}],"name":"stake","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"relay","type":"address"}],"name":"removeRelayByOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"relay","type":"address"}],"name":"unstake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"relay","type":"address"},{"indexed":false,"name":"stake","type":"uint256"},{"indexed":false,"name":"unstakeDelay","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"relay","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"transactionFee","type":"uint256"},{"indexed":false,"name":"stake","type":"uint256"},{"indexed":false,"name":"unstakeDelay","type":"uint256"},{"indexed":false,"name":"url","type":"string"}],"name":"RelayAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"relay","type":"address"},{"indexed":false,"name":"unstakeTime","type":"uint256"}],"name":"RelayRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"relay","type":"address"},{"indexed":false,"name":"stake","type":"uint256"}],"name":"Unstaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"recipient","type":"address"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dest","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"relay","type":"address"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"selector","type":"bytes4"},{"indexed":false,"name":"reason","type":"uint256"}],"name":"CanRelayFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"relay","type":"address"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"selector","type":"bytes4"},{"indexed":false,"name":"status","type":"uint8"},{"indexed":false,"name":"charge","type":"uint256"}],"name":"TransactionRelayed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"relay","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Penalized","type":"event"}];
      relayInstance = await new web3.eth.Contract(
        relayHubAbi,
        relayHubAddress
      );

      balance = await getDappBalance(web3, instance);
      console.log("The Istance: ", instance);
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
    return <div>Dapp Balance in Relay Hub: {this.state.relayBalance} Eth</div>;
  }
}
