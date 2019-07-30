import React, { Component } from "react";
import { Form, Button } from "rimble-ui";
import styles from "./ChatInput.module.scss";
import { Loader, Flash } from "rimble-ui";

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, value: "", message: "Send", error: false };
    this.instance = this.props.instance ? this.props.instance.methods : null;
    this.accounts = this.props.accounts;
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { signingAccount, instance, fetching, setFetchStatus } = this.props;
    if (!fetching) {
      setFetchStatus(true);
      try {
        const tx = await instance.methods
        .postMessage(this.state.value)
        .send({ from: signingAccount });
      const txHash = tx.transactionHash;
      this.pollfortx(txHash);
      this.setState({ validated: false, value: "" });
      } catch (error) {
        console.log("THE ERROR: ", error)
        this.setState({error: true})
        setFetchStatus(false);
      }
 
    }
  };

  pollfortx = async tx => {
    const { web3, setFetchStatus } = this.props;
    let newBlock;
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
          this.setState({ message: "ERROR" });
          
        }
      }
    };

    newBlock = web3.eth.subscribe("newBlockHeaders");
    newBlock.on("data", checkBlock());
  };

  handleValidation = e => {
    this.setState({ validated: true, value: e.target.value });
  };

  render() {
    return (
      <div className={styles.chatInput}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field
            label="Chat Message"
            width={1}
            validated={this.state.validated}
          >
            <Form.Input
              type="text"
              required
              width={1}
              value={this.state.value}
              onChange={this.handleValidation}
            />
          </Form.Field>
          <Button type="submit" width={1}>
            {this.props.fetching ? <Loader color="white" /> : this.state.message}
          </Button>
        </Form>
        <div>
          {this.state.error ? <div><Flash my={3} variant="danger" onClick={()=> this.setState({error: false})}>
Error: Check console for details. Click to dismiss. 
</Flash></div> : <div></div>}
        </div>
      </div>
    );
  }
}
