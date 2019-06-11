import React, { Component } from "react";
import { Button } from 'rimble-ui';
import styles from './FundMetaMask.module.scss';

export default class FundMetaMask extends Component {
  constructor(props){
    super(props);

  }

  fund = async () => {
    const {ganacheAccounts, accounts, ganacheWeb3} = this.props;
    const tx = await ganacheWeb3.eth.sendTransaction({from: ganacheAccounts[0], to: accounts[0], value: 2e18});
    console.log(`Funding Metamask Transaction: ${tx}`);
  }

  render()  {
    const { networkId, accounts, balance, isMetaMask } = this.props;
    return (<div><Button size="small" onClick={()=> this.fund()}>Fund Meta Mask</Button></div>
    );
  }
}
