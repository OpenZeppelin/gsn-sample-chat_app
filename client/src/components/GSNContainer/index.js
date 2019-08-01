import React, { useState } from "react";
import { Button, Tooltip } from "rimble-ui";
import styles from "./GSNContainer.module.scss";

const GSNContainer = props => {
  console.log("The props: ", props);
  const { web3Context } = props;
  const { lib } = web3Context;

  const [state, setState] = useState(false);
  const setProvider = () => {};

  const metaMaskProvider = () => {
    return (
      <Tooltip
        message="Sign your transaction inside MetaMask in the traditional way."
        placement="top"
      >
        <Button size="small" onClick={() => setProvider("MetaMask")}>
          MetaMask
        </Button>
      </Tooltip>
    );
  };

  const metaMaskSigner = () => {
    return (
      <Tooltip
        message="Use MetaMask to sign a message for the GSN Relay but not to sign a transaction."
        placement="top"
      >
        <Button size="small" onClick={() => setProvider("MMSigner")}>
          MM Signer
        </Button>
      </Tooltip>
    );
  };

  const gsnProvider = () => {
    return (
      <Tooltip
        message="Use a keypair, generated in the browser, to sign a message for the GSN Relay. No MetaMask involved!"
        placement="top"
      >
        <Button size="small" onClick={() => setProvider("Ephemeral")}>
          Ephemeral
        </Button>
      </Tooltip>
    );
  };

  if (state) {
    return (
      <div>
        <div className={styles.small} onClick={() => setState(!state)}>
          Close Options...
        </div>
        {window.ethereum && typeof(window.ethereum.isMetamask) ? metaMaskProvider() : null}
        {window.ethereum && typeof(window.ethereum.isMetamask) ? metaMaskSigner() : null}
        {gsnProvider()}
      </div>
    );
  } else {
    return (
      <div className={styles.small} onClick={() => setState(!state)}>
        Advanced Options...
      </div>
    );
  }
};

export default GSNContainer;
