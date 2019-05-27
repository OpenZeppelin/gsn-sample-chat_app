import React, { Component } from "react";
import { PublicAddress, Blockie } from 'rimble-ui';
import styles from './ChatWindow.module.scss';

export default class ChatWindow extends Component {



  render()  {
    const { networkId, accounts, balance, isMetaMask } = this.props;
    return (
      <div className={styles.web3}>
       Chat Window
      </div>
    );
  }
}
