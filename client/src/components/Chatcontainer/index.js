import React, { Component } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

const mockMSG = {
  user: "0x00000000000",
  msg: "Hello Worlds!",
  timestamp: 2345432
};
const mockChats = [mockMSG, mockMSG, mockMSG];

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.handleAddMsg = this.handleAddMsg.bind(this);
  }

  handleAddMsg = e => {
    let mockMSG2 = { user: "0x00000000000", msg: e, timestamp: 2345432 };
    let messages = [...this.state.messages, mockMSG2];

    this.setState((state, props) => {
      return { messages: messages };
    });
  };

  render() {
    //const { networkId, accounts, balance, isMetaMask } = this.props;
   //console.log(this.state);
    return (
      <div className={styles.chatContainer}>
        <ChatWindow messages={this.state.messages} />
        <ChatInput submitMessage={this.handleAddMsg} />
      </div>
    );
  }
}
