import React, { Component } from "react";
import { Button } from "rimble-ui";

export default class FundMetaMask extends Component {
  fund = async () => {
    const { ganacheAccounts, accounts, ganacheWeb3 } = this.props;
    await ganacheWeb3.eth.sendTransaction({
      from: ganacheAccounts[0],
      to: accounts[0],
      value: 2e18
    });
  };

  render() {
    return (
      <div>
        <Button size="small" onClick={() => this.fund()}>
          Fund Meta Mask
        </Button>
      </div>
    );
  }
}
