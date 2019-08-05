import React from "react";
import styles from "./ChatWindow.module.scss";
import { Blockie } from "rimble-ui";
import Filter from "bad-words";
import { Loader } from "rimble-ui";

const ChatWindow = props => {
  const { messages } = props;
  const filter = new Filter();
  const listMsg = messages.slice(0, 5).map(msg => {
    msg.message = filter.clean(msg.message);
    return (
      <div className={styles.singleMessage} key={msg.uuid}>
        <div className={styles.blockie}>
          {msg.mined ?
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
                  /> : <Loader color="blue" size="25px" />}

        </div>
        <div className={styles.mined }><span className={styles.singleMessageText}>{msg.message}</span></div>
      </div>
    );
  });
  return <div className={styles.chatWindow}>{listMsg}</div>;
};

export default ChatWindow;
