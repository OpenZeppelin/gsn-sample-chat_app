import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";
import styles from "./GSNContainer.module.scss";
import { useWeb3Injected } from "@openzeppelin/network";

const GSNContainer = props => {
  const { web3Context, chatAppInstance, ChatAppAbi } = props;
  const [toggleState, setToggleState] = useState(false);

  let injected = null;
  try {
    injected = useWeb3Injected();
    injected.requestAuth();
  } catch (error) {
    console.log(error);
  }

  const [state, setState] = useState({ instance: null });

  useEffect(() => {
    let instance = null;
    if (injected) {
      console.log("Accounts", injected);
      instance = new injected.lib.eth.Contract(
        ChatAppAbi.abi,
        props.chatAppInstance._address
      );
    }
    console.log("Instance: ", instance);
    setState({ instance });
  }, [injected]);

  const donate = async () => {
    let tx;
    console.log("here");
    if (state.instance) {
      try {
        tx = await state.instance.methods
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
