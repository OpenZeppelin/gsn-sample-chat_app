import React, { useState, useEffect } from "react";
import { Form, Button } from "rimble-ui";
import styles from "./ChatInput.module.scss";
import { Loader, Flash } from "rimble-ui";

const ChatInput = props => {
 
  const { instance, signingAccount, fetching, web3, setFetchStatus } = props;
  console.log("Chat input props: ", props);

  const defaultState = {
    validated: false,
    value: "",
    message: "Send",
    error: false
  };
  const [state, setState] = useState(defaultState);

  let newBlock = null;



  useEffect(() => {
    if(newBlock){
  return () => newBlock.unsubscribe();
    }
  }, [newBlock]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!fetching) {
      setFetchStatus(true);
      try {
        const tx = await instance.methods
          .postMessage(state.value)
          .send({ from: signingAccount });
        const txHash = tx.transactionHash;
        pollfortx(txHash);
        setState({ validated: false, value: "" });
      } catch (error) {
        console.log("THE ERROR: ", error);
        setState({ error: true });
        setFetchStatus(false);
      }
    }
  };

  const pollfortx = async tx => {
    
    let currentBlock = await web3.eth.getBlockNumber();

    const checkBlock = async () => {
      const included = await web3.eth.getTransaction(tx);
      if (included) {
        newBlock.unsubscribe();
        setFetchStatus(false);
      } else {
        const blockNumber = await web3.eth.getBlockNumber();
        if (blockNumber - currentBlock > 5) {
          newBlock.unsubscribe();
          setFetchStatus(false);
          setState({ message: "ERROR" });
        }
      }
    };

    newBlock = web3.eth.subscribe("newBlockHeaders");
    newBlock.on("data", checkBlock());
  };

  const handleValidation = e => {
    setState({ ...state, validated: true, value: e.target.value });
  };

  console.log("Chat input State: ", state);
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
          {fetching ? <Loader color="white" /> : state.message}
        </Button>
      </Form>
      <div>
        {state.error ? (
          <div>
            <Flash
              my={3}
              variant="danger"
              onClick={() => setState({ error: false })}
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
