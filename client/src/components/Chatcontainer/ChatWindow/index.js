import React, { Component } from "react";
import styles from "./ChatWindow.module.scss";
import Message from "../Message/index";

export default class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: this.props.messages };

  }



  render() {
    console.log(this.state.messages);
    const {messages} = this.state;
    const listMsg = messages.map((msg) => <li>{msg.msg} by: {msg.user} at: {msg.timestamp}</li>) 
    // const { networkId, accounts, balance, isMetaMask } = this.props;
    return (<div className={styles.chatWindow}>{listMsg}</div>)
  }
}
