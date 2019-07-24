import React from "react";
import styles from "./ChatWindow.module.scss";
import { Blockie } from "rimble-ui";

const ChatWindow = props => {
  const { messages } = props;
  const listMsg = messages.map(msg => (
    <div className={styles.singleMessage} key={msg.uuid}>
      <div className={styles.blockie}>
        <Blockie
          className={styles.blockie}
          opts={{
            seed: msg.user,
            color: "#dfe",
            bgcolor: "#d71",
            size: 5,
            scale: 5,
            spotcolor: "#000"
          }}
        />
      </div>
      {msg.message}
    </div>
  ));
  return <div className={styles.chatWindow}>{listMsg}</div>;
};

export default ChatWindow;
