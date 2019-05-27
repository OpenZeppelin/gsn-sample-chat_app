import React, { Component } from "react";
import styles from "./ChatWindow.module.scss";
import Message from "../Message/index";

const ChatWindow = props => {
  const { messages } = props;
  
  const listMsg = messages.map(msg => (
    <li>
      {msg.msg} by: {msg.user} at: {msg.timestamp}
    </li>
  ));

  return <div className={styles.chatWindow}>{listMsg}</div>;
};

export default ChatWindow;
