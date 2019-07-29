import React, { Component } from "react";
import { Button } from "rimble-ui";

export default class FundMetaMask extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { balance: null };
  }

  componentDidMount = async () => {
    this._isMounted = true;

    this.timer = setInterval(() => this.getBalance(), 1000);
  
  };

  componentWillUnmount(){
    clearInterval(this.timer);
    this.timer=null;
    this._isMounted = false;
  }

  getBalance = async () => {
    const { web3, accounts } = this.props;
    let balance;

    if (web3) {
      try {
        balance = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        if(this._isMounted) this.setState({ balance });
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
    return (
      <div>
        <Button size="small" onClick={() => this.fund()}>
          Fund Meta Mask: (balance: {this.state.balance})
        </Button>
      </div>
    );
  }
}
