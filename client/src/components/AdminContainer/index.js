import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";

const Admin = props => {

  const defaultState = {};
  const [state, setState] = useState(defaultState);

  return (
    <div className="AdminContainer"><Button>New Poll</Button></div>
  )
};

export default Admin;
