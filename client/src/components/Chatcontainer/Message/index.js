import React from 'react';
import styles from "./Message.module.scss";


function Message(props) {
  // Declare a new state variable, which we'll call "count"

  const {message, user, timestamp} = props;
  return (
    <div class="singleMessage">
       {message}
       By: {user} At: {timestamp}
    </div>
  );
}

export default Message;