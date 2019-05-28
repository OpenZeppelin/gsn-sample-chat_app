import React, { Component } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Web3 from "web3";

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], ...props };
  }

  unsubscribe = null;

  componentDidMount = async () => {
    console.log("Mounting!");
    const {instance} = this.props;
    await this.getAllMsg();
    const subscription = await this.subscribeLogEvent(instance, "message");
    console.log("This is the subscription: ", subscription);
    //this.unsubscribe = await this.subscribeToMessages();
  };

  subscribeLogEvent = async (instance, eventName) => {
    
    const web3 = new Web3(window.ethereum);
    console.log("HERE!!!");
    const eventJsonInterface = web3.utils._.find(
      instance._jsonInterface,
      o => o.name === eventName && o.type === 'event',
    );
    
    const subscription = web3.eth.subscribe('logs', {
      address: instance.options.address,
      topics: [eventJsonInterface.signature]
    }, (error, result) => {
      if (!error) {
        const eventObj = web3.eth.abi.decodeLog(
          eventJsonInterface.inputs,
          result.data,
          result.topics.slice(1)
        )
        console.log(`New ${eventName}!`, eventObj)
        const {message, timestamp, user} = eventObj;
        const msg = {message, timestamp, user};
        this.setState(() => {
          return { ...this.state, messages: [...this.state.messages, msg]  };
        });
      }
    })
    console.log("The Subscription is: ", subscription);
  return subscription;
  }

  getAllMsg = async () => {
    const { instance } = this.props;
    let messages = [];

    const logs = await instance.getPastEvents("message", {
      fromBlock: 0,
      toBlock: "latest"
    });

    logs.forEach(el => {
      const { message, timestamp, user } = el.returnValues;
      messages.push({ message, timestamp, user });
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
      </div>
    );
  }
}
