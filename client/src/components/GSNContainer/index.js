import React, { Component } from "react";
import { Form, Button } from "rimble-ui";
import styles from "./GSNContainer.module.scss";

export default class GSNContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ validated: true });
  };

  handleValidation = e => {
    e.target.parentNode.classList.add("was-validated");
  };

  render() {
    return (
      <div className={styles.button}>
<Button size="small">
  MetaMask
</Button><Button size="small">
  MM Signer
</Button><Button size="small">
  Ephemeral
</Button>
      </div>
    );
  }
}
