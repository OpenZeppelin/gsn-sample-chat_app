import React, { useState, useEffect } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import RelayContainer from "../RelayContainer";
import GSNContainer from "../GSNContainer/index.js";

const ChatContainer = props => {
  const { web3Context, chatAppInstance, setFetchState } = props;
  const { lib } = web3Context;
  const blockCount = 400;

  const defaultState = { messages: [] };
  let unsubscribe = null;

  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const load = async () => {
      await getAllMsg();
      unsubscribe = await subscribeLogEvent(chatAppInstance, "message");
    };

    load();
    if (unsubscribe) {
      return () => unsubscribe.unsubscribe();
    }
  }, []);

  const subscribeLogEvent = async (instance, eventName) => {
    const eventJsonInterface = lib.utils._.find(
      instance._jsonInterface,
      o => o.name === eventName && o.type === "event"
    );

    const subscription = lib.eth.subscribe(
      "logs",
      {
        address: instance.options.address,
        topics: [eventJsonInterface.signature]
      },
      (error, result) => {
        if (!error) {
          //@ This code will give you access to the eventObj.
          //@ This is nice for displaying the incoming message.
          //
          // const eventObj = lib.eth.abi.decodeLog(
          //   eventJsonInterface.inputs,
          //   result.data,
          //   result.topics.slice(1)
          // );
          // const { message, timestamp, user, uuid, mined } = eventObj;
          // const msg = { message, timestamp, user, uuid, mined};
          // console.log("New Message: ", msg);
          getAllMsg();
        }
      }
    );
    return subscription;
  };

  const getAllMsg = async () => {
    let messages = [];
    const currentblock = await lib.eth.getBlockNumber();
    const logs = await chatAppInstance.getPastEvents("message", {
      fromBlock: currentblock - blockCount,
      toBlock: "latest"
    });

    logs.forEach(el => {
      const { message, timestamp, user, uuid } = el.returnValues;
      messages = [
        { message: message, timestamp, user, uuid, mined: true },
        ...messages
      ];
    });

    setState(() => {
      return { messages: messages };
    });
    setFetchState(false);

  };

  const addSingleMessage = async message => {
    const msg = {
      message,
      timestamp: Date.now(),
      user: null,
      uuid: null,
      mined: false
    };
    setState({ ...state, messages: [msg, ...state.messages] });
  };

  return (
    <div className={styles.chatContainer}>
      <ChatWindow messages={state.messages} {...props} />
      <ChatInput
        {...props}
        addSingleMessage={addSingleMessage}
        getAllMsg={getAllMsg}
      />
      <GSNContainer {...props} />
      <RelayContainer {...props} />
    </div>
  );
};

export default ChatContainer;
