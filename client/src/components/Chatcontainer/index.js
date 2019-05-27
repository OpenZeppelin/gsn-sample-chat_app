import React, { Component } from "react";
import styles from './ChatContainer.module.scss';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

export default class ChatContainer extends Component {


  render()  {
    //const { networkId, accounts, balance, isMetaMask } = this.props;
    return (
      <div className={styles.chatContainer}>
        <ChatWindow/>
        <ChatInput/>
      </div>
    );
  }
}
