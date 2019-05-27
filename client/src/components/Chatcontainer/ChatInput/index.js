import React, { Component } from "react";
import { Form, Button } from 'rimble-ui';
import styles from './ChatInput.module.scss';


export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ validated: true });
  };

  handleValidation = e => {
    e.target.parentNode.classList.add('was-validated');
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field label="Chat Message" width={1}>
          <Form.Input
            type="text"
            required
            width={1}
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
          Sign Up
        </Button>
      </Form>
    );
  }
}
