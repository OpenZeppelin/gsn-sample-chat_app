import React, { Component } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Web3 from "web3";

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], ...props };
    this.subWeb3 = null;
  }

  unsubscribe = null;

  componentDidMount = async () => {

    this.subWeb3 = new Web3(window.ethereum);
    const { instance, web3 } = this.props;
    await this.getAllMsg();
    this.unsubscribe = await this.subscribeLogEvent(instance, "message");
    
    // const sub = this.subWeb3.eth.subscribe('newBlockHeaders')
    // sub.subscribe((err, result) => {
    //   if(err)console.log(err);
    // }).on('data', async (txHash) => {
    //   console.log("DATA FIRED!!!", txHash);
    // })


    //console.log("Subscription is: ", sub);
    //console.log("This is the subscription: ", subscription);
    //this.unsubscribe = await this.subscribeToMessages();
  };

  waitForMinedTransaction = txHash => {


  };

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
          //console.log(`New ${eventName}!`, eventObj)
          const { message, timestamp, user, uuid } = eventObj;
          console.log("UUID: ", uuid);
          const msg = { message, timestamp, user , uuid};
          this.setState(() => {
            return { ...this.state, messages: [...this.state.messages, msg] };
          });
        }
      }
    );
    //console.log("The Subscription is: ", subscription);
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
      messages.push({ message, timestamp, user, uuid });
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
