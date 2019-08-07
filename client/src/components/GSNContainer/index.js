import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";
import styles from "./GSNContainer.module.scss";
import { useWeb3Injected } from "@openzeppelin/network";

const GSNContainer = props => {
  const { web3Context, chatAppInstance, ChatAppAbi } = props;
  const [toggleState, setToggleState] = useState(false);
  console.log(web3Context);

  let injected = null;
  injected = useWeb3Injected();
  console.log("injected", injected.accounts);

  const [state, setState] = useState({ instance: null });

  useEffect(() => {
    let instance = null;
    if (injected.connected) {
      instance = new injected.lib.eth.Contract(
        ChatAppAbi.abi,
        props.chatAppInstance._address
      );
    }
    setState({ instance });
  }, [injected.connected]);

  const donate = async () => {
    let tx;
    console.log("here");
    if (state.instance) {
      try {
        tx = state.instance.methods
          .deposit()
          .send({ from: injected.accounts[0], value: "500000000000000000" });
        console.log(tx);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (state) {
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
          <div className={styles.smallBold}>Browser Public Key: </div>
          <div className={styles.small}>{props.signKey.address}</div>
          <div className={styles.smallBold}>Contract Address:</div>{" "}
          <div className={styles.small}>{props.chatAppInstance._address}</div>
          <Button size="small" onClick={() => donate()}>
            Donate to Contract
          </Button>
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
