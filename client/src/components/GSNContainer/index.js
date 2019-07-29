import React, { Component } from "react";
import { Button, Tooltip } from "rimble-ui";
import styles from "./GSNContainer.module.scss";

export default class GSNContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false };
    this.setProvider = this.props.setProvider;
    console.log(this.props);
  }

  

  render() {
    console.log("GSNCONTAINER PROPS", this.props);
    return (<div>
      <div className={styles.button}>
        
        <Tooltip
          message="Sign your transaction inside MetaMask in the traditional way."
          placement="top"
        >
          <Button size="small" onClick={() => this.setProvider("MetaMask")}>
            MetaMask
          </Button>
        </Tooltip>
        <Tooltip
          message="Use MetaMask to sign a message for the GSN Relay but not to sign a transaction."
          placement="top"
        >
          <Button size="small" onClick={() => this.setProvider("MMSigner")}>
            MM Signer
          </Button>
        </Tooltip>
        <Tooltip
          message="Use a keypair, generated in the browser, to sign a message for the GSN Relay. No MetaMask involved!"
          placement="top"
        >
          <Button size="small" onClick={() => this.setProvider("Ephemeral")}>
            Ephemeral
          </Button>
        </Tooltip>
      </div>
      <div>{this.props.metaTxSigner}</div>
      </div>
    );
  }
}
