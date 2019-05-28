import React, { Component } from "react";
import styles from "./ChatWindow.module.scss";
import Message from "../Message/index";

//We use a functional component here to peel off the messages
//from props and map through them. 
const ChatWindow = props => {
  const { messages } = props;
  
  const listMsg = messages.map(msg => (
    <div class="singleMessage">
      {msg.msg} <br/>by: {msg.user}
    </div>
  ));

  return <div className={styles.chatWindow}>{listMsg}</div>;
};

export default ChatWindow;
