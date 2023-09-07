import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Summary(props) {

    const [actual, setActual] = useState(2200);
    const [due, setDue] = useState(0);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
      let totalDue = 0;
      props.planDates.forEach((pd) => {
        totalDue += pd.amount;
      });
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
                <Form.Label column sm="2">Actual:</Form.Label>
                <Col sm="8">
                  <Form.Control type="number" step="0.01" value={actual} onChange={handleActualChange} />
                </Col>
            </Form.Group>
            </Form>
        <p>Due: {due}</p>
        <p>Remaining: {remaining}</p>
      </div>
    </div>
  );

  
}