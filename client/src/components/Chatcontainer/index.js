import React, { useState, useEffect } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Web3 from "web3";
import GSNContainer from "../GSNContainer";
import FundMetaMask from "../fundMetaMask/index";

const ChatContainer = props => {
  const { instance } = props;

  //Maybe this isn't the best idea for props?
  const defaultState = { messages: [], ...props };
  let subscriptionProvider = null;
  let unsubscribe = null;

  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const load = async () => {
      subscriptionProvider = new Web3(window.ethereum);

      await getAllMsg();
      unsubscribe = await subscribeLogEvent(instance, "message");
    };

    load();
    if (unsubscribe) {
      return () => unsubscribe.unsubscribe();
    }
  }, []);

  const subscribeLogEvent = async (instance, eventName) => {
    const eventJsonInterface = subscriptionProvider.utils._.find(
      instance._jsonInterface,
      o => o.name === eventName && o.type === "event"
    );

    const subscription = subscriptionProvider.eth.subscribe(
      "logs",
      {
        address: instance.options.address,
        topics: [eventJsonInterface.signature]
      },
      (error, result) => {
        if (!error) {
          const eventObj = subscriptionProvider.eth.abi.decodeLog(
            eventJsonInterface.inputs,
            result.data,
            result.topics.slice(1)
          );
          const { message, timestamp, user, uuid } = eventObj;
          const msg = { message, timestamp, user, uuid };
          setState(() => {
            return { ...state, messages: [...state.messages, msg] };
          });
        }
      }
    );
    return subscription;
  };

  const getAllMsg = async () => {
    const { instance } = props;
    let messages = [];

    const logs = await instance.getPastEvents("message", {
      fromBlock: 0,
      toBlock: "latest"
    });

    logs.forEach(el => {
      const { message, timestamp, user, uuid } = el.returnValues;
      messages = [{ message: message, timestamp, user, uuid },...messages];
    });

    setState(() => {
      return { messages: messages };
    });
  };

  return (
    <div className={styles.chatContainer}>
      <ChatWindow messages={state.messages} {...props} />
      <ChatInput {...props} />
      <GSNContainer {...props} />
      {props.isMetamask ? <FundMetaMask {...props} /> : <div />}
    </div>
  );
};

export default ChatContainer;
