import React, { useState } from "react";
import { Button, Tooltip } from "rimble-ui";
import styles from "./GSNContainer.module.scss";

const GSNContainer = props => {
  console.log("props", props);
  const [state, setState] = useState(false);

  if (state) {
    return (
      <div>
        <div className={styles.small} onClick={() => setState(!state)}>
          Close Options...
        </div>
        <div className={styles.advanced}>
          <div className={styles.smallBold}>Browser Public Key: </div>
          <div className={styles.small}>{props.signKey.address}</div>
          <div className={styles.smallBold}>
            Contract Address:
          </div>{" "}
          <div className={styles.small}>{props.chatAppInstance._address}</div>
        </div>
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
