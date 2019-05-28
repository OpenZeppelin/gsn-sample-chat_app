import React, { Component } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], ...props };
  }

  unsubscribe = null;

  componentDidMount = async () => {
    await this.getAllMsg();
    this.unsubscribe = await this.subscribeToMessages();
  };

  subscribeToMessages = async () => {
    const { instance } = this.props;
    const subscription = await instance.events.message().on("data", event => {
      this.getAllMsg();
    });

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
