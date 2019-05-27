import React, { Component } from "react";
import { Form, Button } from "rimble-ui";
import styles from "./ChatInput.module.scss";

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, value: '' };
  }

  handleSubmit = e => {
    e.preventDefault();
    e.target.parentNode.classList.add("was-validated");
    this.setState({ validated: true,
    value: '' });
    this.props.submitMessage(this.state.value);
  };

  handleValidation = e => {
    e.target.parentNode.classList.add("was-validated");
    this.setState({value: e.target.value});

  };

  render() {
    
    return (
      <div className={styles.chatInput}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field label="Chat Message" width={1}>
            <Form.Input
              type="text"
              required
              width={1}
              value={this.state.value}
              onChange={this.handleValidation}
            />
          </Form.Field>
          {/* <Form.Field validated={this.state.validated} label="Password" width={1}>
          <Form.Input
            type="password"
            required
            width={1}
            onChange={this.handleValidation}
          />
        </Form.Field>
        <Form.Check
          label="Remember me?"
          mb={3}
          onChange={this.handleValidation}
        /> */}
          <Button type="submit" width={1}>
            send
          </Button>
        </Form>
      </div>
    );
  }
}
