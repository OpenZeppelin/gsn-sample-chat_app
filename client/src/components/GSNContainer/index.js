import React, { Component } from "react";
import { Button, Tooltip } from "rimble-ui";
import styles from "./GSNContainer.module.scss";

export default class GSNContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false };
    this.setProvider = this.props.setProvider;
  }

  metaMaskProvider = () => {
    return (
      <Tooltip
        message="Sign your transaction inside MetaMask in the traditional way."
        placement="top"
      >
        <Button size="small" onClick={() => this.setProvider("MetaMask")}>
          MetaMask
        </Button>
      </Tooltip>
    );
  };

  metaMaskSigner = () => {
    return (
      <Tooltip 
        message="Use MetaMask to sign a message for the GSN Relay but not to sign a transaction."
        placement="top"
      >
        <Button size="small" onClick={() => this.setProvider("MMSigner")}>
          MM Signer
        </Button>
      </Tooltip>
    );
  };

  gsnProvider = () => {
    return (
      <Tooltip
        message="Use a keypair, generated in the browser, to sign a message for the GSN Relay. No MetaMask involved!"
        placement="top"
      >
        <Button size="small" onClick={() => this.setProvider("Ephemeral")}>
          Ephemeral
        </Button>
      </Tooltip>
    );
  };

  render() {
    return (
      <div>
        <div className={styles.button} />
        {this.props.isMetaMask ? this.metaMaskProvider() : null}
        {this.metaMaskSigner()}
        {this.gsnProvider()}
        <div>{this.props.metaTxSigner}</div>
      </div>
    );
  }
}
