import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import { InputGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Summary(props) {

    const [actual, setActual] = useState(0);
    const [due, setDue] = useState(0);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
      let totalDue = 0;
      if(props.planDates){
      props.planDates.forEach((pd) => {
          totalDue += pd.amount;
        });
      }
      //setActual(process.env.REACT_APP_MONTHLY_INCOME - totalDue);
      setDue(totalDue.toFixed(2));
      setRemaining((actual - totalDue).toFixed(2));
    }, [props.planDates, actual]);

    const handleActualChange = (e) => {
      setActual(e.target.value);
    };



  return (
    <div>
      <h2>Summary</h2>
      <div>
        <Form>
          <Form.Group controlId="actualValue" as={Row} className="mb-3">
            <InputGroup>
              <InputGroup.Text>Current balance</InputGroup.Text>
              <Form.Control aria-label="Current balance" type="number" step="1" value={actual}   onChange={handleActualChange}/>
            </InputGroup>
        </Form.Group>
        </Form>
        <p>Due: {due}</p>
        <p>Remaining: {remaining}</p>
      </div>
    </div>
  );


}