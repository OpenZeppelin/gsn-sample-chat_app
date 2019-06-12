import React, { Component } from "react";
import { Button } from "rimble-ui";
import styles from "./GSNContainer.module.scss";

export default class GSNContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false };
    this.setProvider = this.props.setProvider;
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
        <Button size="small" onClick={() => this.setProvider("MetaMask")}>
          MetaMask
        </Button>
        <Button size="small" onClick={() => this.setProvider("MMSigner")}>
          MM Signer
        </Button>
        <Button size="small" onClick={() => this.setProvider("Ephemeral")}>
          Ephemeral
        </Button>
      </div>
    );
  }
}
