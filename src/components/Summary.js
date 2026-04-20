import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import { InputGroup } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Summary.css';

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
      // Prefer the externally provided current balance if present, otherwise use the local actual state
      const actualVal = Number(props.currentBalance ?? actual) || 0;
      setDue(totalDue.toFixed(2));
      setRemaining((actualVal - totalDue).toFixed(2));
      //setSpendPerWeek(props.spendPerWeek.toFixed(2));
    }, [props.planDates, actual, props.currentBalance]);

    // When user edits the Current balance control we update local state and notify parent via props.onCurrentBalanceChange
    const handleActualChange = (e) => {
      const val = e.target.value;
      setActual(val);
      if (props.onCurrentBalanceChange) {
        const num = val === '' ? null : Number(val);
        props.onCurrentBalanceChange(num);
      }
    };


  return (
    <div>
      <h2>Summary</h2>
      <div>
        <Form>
          <Form.Group controlId="actualValue" as={Row} className="mb-3">
            <InputGroup>
              <InputGroup.Text>Current balance</InputGroup.Text>
              <Form.Control
                aria-label="Current balance"
                type="number"
                step="1"
                value={props.currentBalance ?? actual}
                onChange={handleActualChange}
              />
            </InputGroup>
          </Form.Group>
        </Form>
        <Table bordered>
          <tbody>
            <tr>
              <td className="text-bold">Due</td>
              <td>{due}</td>
            </tr>
            <tr>
              <td className="text-bold">Remaining</td>
              <td>{remaining}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );


}