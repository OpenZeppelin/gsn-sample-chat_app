import React, { Component } from "react";
import styles from "./ChatWindow.module.scss";
import Message from "../Message/index";

//We use a functional component here to peel off the messages
//from props and map through them.
const ChatWindow = props => {
  const { messages, web3 } = props;

  const listMsg = messages.map(msg => (
    <div className="singleMessage" key={web3.utils.randomHex(2)}>
      {msg.msg} <br />
      by: {msg.user}
    </div>
  ));

  return <div className={styles.chatWindow}>{listMsg}</div>;
};

export default ChatWindow;
