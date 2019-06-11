import React, { Component } from "react";
import { Button } from 'rimble-ui';
import styles from './FundMetaMask.module.scss';

export default class FundMetaMask extends Component {
  constructor(props){
    super(props);
    
  }


  render()  {
    const { networkId, accounts, balance, isMetaMask } = this.props;
    return (<div><Button></Button></div>
    );
  }
}
