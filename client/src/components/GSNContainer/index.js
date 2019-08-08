import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";
import styles from "./GSNContainer.module.scss";
import { useWeb3Injected } from "@openzeppelin/network";
import axios from "axios";

const GSNContainer = props => {
  const { ChatAppAbi } = props;
  const [toggleState, setToggleState] = useState(false);

  let injected = null;
  try {
    injected = useWeb3Injected();
    injected.requestAuth();
  } catch (error) {
    //No injected web3
    injected = null;
  }

  const [state, setState] = useState({ instance: null });
  const [relayState, setRelayState] = useState({
    RelayServerAddress: null,
    MinGasPrice: null,
    Ready: false,
    Version: null
  });

  useEffect(() => {
    let instance = null;
    if (injected) {
      instance = new injected.lib.eth.Contract(
        ChatAppAbi.abi,
        props.chatAppInstance._address
      );
    }

    setState({ instance });
  }, [injected]);

  useEffect(() => {
    axios.get("https://rinkeby-01.gsn.openzeppelin.org/getaddr").then(res => {
      const result = res.data;
      console.log(result);
      setRelayState(result);
    });
  }, []);


  if (toggleState) {
    console.log("Relay info:", relayState);
    return (
      <div>
        <Button
          mainColor="Green"
          size="small"
          onClick={() => setToggleState(!toggleState)}
        >
          Hide Info
        </Button>

        <div className={styles.advanced}>
          <div className={styles.relayState}>
            <div className={styles.small}>
              Relay Ready: {relayState.Ready ? "True" : "False"}
            </div>
            <div className={styles.small}>
              RelayServerAddress: 
            </div>
            <div className={styles.small}>{relayState.RelayServerAddress}</div>
            <div className={styles.small}>
              Minimum Gas Price: {relayState.MinGasPrice}
            </div>
            <div className={styles.small}>
              Relay Version: {relayState.Version}
            </div>
          </div>
          <div className={styles.smallBold}>Browser Public Key: </div>
          <div className={styles.small}>{props.signKey.address}</div>
          <div className={styles.smallBold}>Contract Address:</div>{" "}
          <div className={styles.small}>{props.chatAppInstance._address}</div>
          {injected && injected.connected ? (
            <Button size="small" onClick={() => window.open(`https://gsn.openzeppelin.com/recipients/${props.chatAppInstance._address}`)}>
              Top up Contract
            </Button>
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Button size="small" onClick={() => setToggleState(!toggleState)}>
          Show Info
        </Button>
      </div>
    );
  }
};

export default GSNContainer;
