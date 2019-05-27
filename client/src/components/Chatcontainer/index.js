import React, { Component } from "react";
import { PublicAddress, Blockie } from 'rimble-ui';
import styles from './ChatContainer.module.scss';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

export default class ChatContainer extends Component {


  render()  {
    const { networkId, accounts, balance, isMetaMask } = this.props;
    return (
      <div className={styles.web3}>
        <ChatWindow/>
        <ChatInput/>
      </div>
    );
  }
}
