import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";
import styles from "./SurveyContainer.module.scss";
const queryString = require('query-string');

const SurveyContainer = props => {
  const {location} = props;
  const parsed = queryString.parse(location.search);
  const { web3Context, workshopInstance, signKey } = props;
  const {
    accounts,
    lib,
  } = web3Context;

  const defaultState = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const [surveyState, setSurveyState] = useState(defaultState);
  const previousBlock = 200;
  const from = signKey ? signKey.address : accounts[0];

  useEffect(() => {
    loadSurvey();
  }, []);

  useEffect(() => {
    
    const subscribeToNewResponses = async () => {
      if (workshopInstance) return await subscribeLogEvent(workshopInstance, "optionSelected");
      else return null;
    };

    let unsubscribe = subscribeToNewResponses();
    return () => {unsubscribe.unsubscribe()};
  }, [workshopInstance]);

  const loadSurvey = async () => {
    let count = defaultState;
    const currentblock = await lib.eth.getBlockNumber();
    const logs = await workshopInstance.getPastEvents("optionSelected", {
      filter: {_poll_number: parsed.poll},
      fromBlock: currentblock - previousBlock,
      toBlock: "latest"
    });

    logs.forEach(el => {
      const { _option } = el.returnValues;
      console.log("Return values: ", el.returnValues);
      count = { ...count, [_option]: count[_option] + 1 };
    });
    setSurveyState(count);
  };

  const subscribeLogEvent = async (instance, eventName) => {
    console.log("The Instance for subscribing: ", instance, " eventName: ", eventName);
    const eventJsonInterface = lib.utils._.find(
      instance._jsonInterface,
      o => o.name === eventName && o.type === "event"
    );

    console.log("EventJsonInterface", eventJsonInterface);
    const subscription = lib.eth.subscribe(
      "logs",
      {
        address: instance.options.address,
        topics: [eventJsonInterface.signature]
      },
      (error, result) => {
        if (!error) {
          loadSurvey();
        }
      }
    );
    return subscription;
  };

  const makeSelection = async option => {
    try {
      await workshopInstance.methods
        .selectOption(option, parsed.poll)
        .send({ from });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.counter}>
      <h2 className={styles.question}>Have you used Meta Transactions?</h2>
    <div className={styles.row}>
      <div className={styles.colum}>
        <div className={styles.bigNumber}>{surveyState[1]}</div>
        <div className={styles.buttonBox}>
          <Button className={styles.bigButton} onClick={() => makeSelection(1)}>Yes</Button>
        </div>
      </div>
      <div>{" "}</div>
      <div className={styles.colum}>
        <div className={styles.bigNumber}>{surveyState[2]}</div>
        <div className={styles.buttonBox}>
          <Button className={styles.bigButton} onClick={() => makeSelection(2)}>No</Button>
        </div>
      </div>  
    </div>
    </div>
  );
};
export default SurveyContainer;
