import React, { Component } from "react";
import styles from "./ChatWindow.module.scss";
import Message from "../Message/index";
import { Blockie } from 'rimble-ui';

//We use a functional component here to peel off the messages
//from props and map through them.
const ChatWindow = props => {
  const { messages, web3 } = props;

  const listMsg = messages.map(msg => (
    <div className={styleMedia.singleMessage} key={web3.utils.randomHex(2)}>
       <div className={styles.blockie}><Blockie opts={{
    seed: msg.user,
    color: '#dfe',
    bgcolor: '#a71',
    size: 5,
    scale: 3,
    spotcolor: '#000',
  }}
/></div>{msg.message}
    </div>
  ));

  return <div className={styles.chatWindow}>{listMsg}</div>;
};

export default ChatWindow;
