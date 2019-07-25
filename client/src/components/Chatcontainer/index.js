import React, { Component } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Web3 from "web3";
import GSNContainer from "../GSNContainer";
import FundMetaMask from "../fundMetaMask/index";

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], ...props };
    this.subWeb3 = null;
  }

  unsubscribe = null;

  componentDidMount = async () => {
    this.subWeb3 = new Web3(window.ethereum);
    const { instance } = this.props;
    await this.getAllMsg();
    this.unsubscribe = await this.subscribeLogEvent(instance, "message");
  };

  waitForMinedTransaction = txHash => {};

  subscribeLogEvent = async (instance, eventName) => {
    const eventJsonInterface = this.subWeb3.utils._.find(
      instance._jsonInterface,
      o => o.name === eventName && o.type === "event"
    );

    const subscription = this.subWeb3.eth.subscribe(
      "logs",
      {
        address: instance.options.address,
        topics: [eventJsonInterface.signature]
      },
      (error, result) => {
        if (!error) {
          const eventObj = this.subWeb3.eth.abi.decodeLog(
            eventJsonInterface.inputs,
            result.data,
            result.topics.slice(1)
          );
          const { message, timestamp, user, uuid } = eventObj;
          const msg = { message, timestamp, user, uuid };
          this.setState(() => {
            return { ...this.state, messages: [...this.state.messages, msg] };
          });
        }
      }
    );
    return subscription;
  };

  getAllMsg = async () => {
    const { instance } = this.props;
    let messages = [];

    const logs = await instance.getPastEvents("message", {
      fromBlock: 0,
      toBlock: "latest"
    });

    logs.forEach(el => {
      const { message, timestamp, user, uuid } = el.returnValues;
      messages.push({ message: message, timestamp, user, uuid });
    });

    this.setState(() => {
      return { messages: messages };
    });
  };

  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
  };

  render() {
    return (
      <div className={styles.chatContainer}>
        <ChatWindow messages={this.state.messages} {...this.props} />
        <ChatInput {...this.props} />
        <GSNContainer {...this.props} />
        <FundMetaMask {...this.props} />
      </div>
    );
  }
}
