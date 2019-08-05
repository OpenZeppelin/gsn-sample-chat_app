import React, { useState, useEffect } from "react";
import { Form, Button } from "rimble-ui";
import styles from "./ChatInput.module.scss";
import { Loader, Flash } from "rimble-ui";

const ChatInput = props => {
  const {
    web3Context,
    addSingleMessage,
    chatAppInstance,
    getAllMsg,
    fetchState,
    setFetchState,
    signKey
  } = props;
  console.log("fetchState: ", fetchState);

  const { lib, accounts } = web3Context;
  const from = signKey ? signKey.address : accounts[0];
  const defaultState = {
    validated: false,
    value: "",
    buttonMessage: "Send",
    error: false
  };
  const [state, setState] = useState(defaultState);

  let newBlock = null;

  useEffect(() => {
    if (newBlock) {
      return () => newBlock.unsubscribe();
    }
  }, [newBlock]);

  const handleSubmit = async e => {
    e.preventDefault();
    setFetchState(true);
    try {
      addSingleMessage(state.value);
      const tx = await chatAppInstance.methods
        .postMessage(state.value)
        .send({ from });
      const txHash = tx.transactionHash;

      pollfortx(txHash);
      setState({ ...state, validated: false, value: "" });
    } catch (error) {
      console.log("THE ERROR: ", error);
      setState({ ...state, error: true });
      getAllMsg();
      setFetchState(false);
    }
  };

  const pollfortx = async tx => {
    let currentBlock = await lib.eth.getBlockNumber();

    const checkBlock = async () => {
      const included = await lib.eth.getTransaction(tx);
      if (included) {
        newBlock.unsubscribe();
        getAllMsg();
        setFetchState(false);
      } else {
        const blockNumber = await lib.eth.getBlockNumber();
        if (blockNumber - currentBlock > 5) {
          newBlock.unsubscribe();
          setFetchState(false);
          setState({ message: "ERROR" });
          console.error("Transaction not found in the past five blocks");
        }
      }
    };

    newBlock = lib.eth.subscribe("newBlockHeaders");
    newBlock.on("data", checkBlock);
  };

  const handleValidation = e => {
    setState({ ...state, validated: true, value: e.target.value });
  };

  return (
    <div className={styles.chatInput}>
      <Form onSubmit={handleSubmit}>
        <Form.Field label="Chat Message" width={1} validated={state.validated}>
          <Form.Input
            type="text"
            required
            width={1}
            value={state.value}
            onChange={handleValidation}
          />
        </Form.Field>
        <Button type="submit" width={1}>
          {fetchState.fetching ? <Loader color="white" /> : state.buttonMessage}
        </Button>
      </Form>
      <div>
        {state.error ? (
          <div>
            <Flash
              my={3}
              variant="danger"
              onClick={() => setState({ ...state, error: false })}
            >
              Error: Check console for details. Click to dismiss.
            </Flash>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default ChatInput;
