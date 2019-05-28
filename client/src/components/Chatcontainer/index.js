import React, { Component } from "react";
import styles from "./ChatContainer.module.scss";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

const mockMSG = {
  user: "0xc9b6628b0C44fe39170CFFCc3bd2cbECf15F7B5e",
  msg: "Hello Worlds!",
  timestamp: 2345432,
  mined: true
};
const mockChats = [mockMSG, mockMSG, mockMSG];

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], ...props };
  }

  componentDidMount = async () => {
    await this.getAllMesages();
    const subscription = await this.subscribeToEvents();
  };

  subscribeToEvents = async () => {
    const { accounts, instance, web3 } = this.props;
    let messages = [];

    const subscription = await instance.events.message().on("data", event => {
      this.getAllMesages();
    });

    return subscription;
  };

  getAllMesages = async (count = 10) => {
    const { instance, web3 } = this.props;
    let messages = [];
    const logs = await instance.getPastEvents("message", {
      fromBlock: 0,
      toBlock: "latest"
    });

    logs.forEach(el => {
      const { message, timestamp, user } = el.returnValues;
      messages.push({ message, timestamp, user });
    });

    this.setState((state, props) => {
      return { messages: messages };
    });
  };

  render() {
   // console.log(this.state);
    return (
      <div className={styles.chatContainer}>
        <ChatWindow messages={this.state.messages} {...this.props} />
        <ChatInput {...this.props} />
      </div>
    );
  }
}
