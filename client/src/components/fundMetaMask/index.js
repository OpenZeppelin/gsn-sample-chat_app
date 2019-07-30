import React, { Component } from "react";
import { Button } from "rimble-ui";

export default class FundMetaMask extends Component {
  constructor(props) {
    super(props);
    this.state = { balance: null };
  }

  componentDidMount = async () => {
    this.poll = setInterval(() => this.getBalance(), 1000);
  
  };

  componentWillUnmount(){
    clearInterval(this.timer);
    this.timer=null;
  }

  getBalance = async () => {
    const { web3, accounts } = this.props;
    let balance;

    if (web3) {
      try {
        balance = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        this.setState({ balance });
      } catch (error) {
        console.log(error);
      }
    }
  };

  fund = async () => {
    const { ganacheAccounts, accounts, ganacheWeb3 } = this.props;

    const tx = await ganacheWeb3.eth.sendTransaction({
      from: ganacheAccounts[0],
      to: accounts[0],
      value: 2e18
    });
    if (tx) {
      this.getBalance();
    }
  };

  render() {
    if (process.env.NODE_ENV === 'production') return null;
    if (!this.props.ganacheWeb3) return null;
    return (
      <div>
        <Button size="small" onClick={() => this.fund()}>
          Fund Meta Mask: (balance: {this.state.balance})
        </Button>
      </div>
    );
  }
}
