import React, { Component } from "react";
import styles from "./ChatWindow.module.scss";
import Message from "../Message/index";

const ChatWindow = (props) => {
  console.log("Ths props: ", props);

    const {messages} = props;
    console.log(messages);
    const listMsg = messages.map((msg) => <li>{msg.msg} by: {msg.user} at: {msg.timestamp}</li>) 
    // const { networkId, accounts, balance, isMetaMask } = this.props;
    return (<div className={styles.chatWindow}>{listMsg}</div>)
  
}

export default ChatWindow;