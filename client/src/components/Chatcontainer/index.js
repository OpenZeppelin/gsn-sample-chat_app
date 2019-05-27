import React, { Component } from "react";
import styles from './ChatContainer.module.scss';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

const mockMSG = {user: "0x00000000000",
msg: "Hello Worlds!",
timestamp: 2345432}
const mockChats = [mockMSG,mockMSG,mockMSG];

export default class ChatContainer extends Component {


  render()  {
    //const { networkId, accounts, balance, isMetaMask } = this.props;
    return (
      <div className={styles.chatContainer}>
        <ChatWindow messages={mockChats}/>
        <ChatInput/>
      </div>
    );
  }
}
