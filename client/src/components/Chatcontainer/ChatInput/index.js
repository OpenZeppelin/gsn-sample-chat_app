import React, { Component } from "react";
import { Form, Button } from "rimble-ui";
import styles from "./ChatInput.module.scss";

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, value: "", fetching: false };
    this.instance = this.props.instance.methods;
    this.accounts = this.props.accounts;
    
  }

  handleSubmit = async e => {
    e.preventDefault();
    const {signingAccount, instance} = this.props;
    console.log("singing trasnaction with: ", signingAccount);
    const tx = await instance.methods
      .postMessage(this.state.value)
      .send({ from: signingAccount});
    const txHash = tx.transactionHash;

    this.setState({ validated: false, value: "" });
  };

  pollfortx = tx => {};

  handleValidation = e => {
    this.setState({ validated: true, value: e.target.value });
  };

  render() {
    return (
      <div className={styles.chatInput}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field
            label="Chat Message"
            width={1}
            validated={this.state.validated}
          >
            <Form.Input
              type="text"
              required
              width={1}
              value={this.state.value}
              onChange={this.handleValidation}
            />
          </Form.Field>
          <Button type="submit" width={1}>
            send
          </Button>
        </Form>
      </div>
    );
  }
}
