import React, { useState, useEffect } from "react";
import Summary from './Summary';
import Table from 'react-bootstrap/Table';
import Controls from './Controls';
import './Table.css'
import { v4 as uuidv4 } from 'uuid';
import {handlePostRefresh} from "../data/DutTillPayday.ts";
import {Row, Col} from 'react-bootstrap';

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;
export default function Grid() {
  const [planDates, setPlanDates] = useState([]);
  const [amountDue, setAmountDue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh('http://localhost:5000/dtp/current', 500);
        console.log("planDates - ", plandates);
        setPlanDates(plandates.planDates);
        console.log(plandates.planDates);
        setAmountDue(plandates.amountDue);
    };

    fetchData();
}, [serverUrl, handlePostRefresh]);
  const receiveDataFromChild = async (data) => {
    console.log("Setting plan date child data", await data)
    setPlanDates(await data);
  };

  const formatDate = (date) => {
    console.log(date);
    return new Date(date).toLocaleDateString();
  };


return (
  <div>
    <Row>
    <Col md={12}>
        <Controls sendDataToParent={receiveDataFromChild} />
    </Col>
    </Row>
    <Row>
    <Col md={3}>
      <Summary planDates={planDates} />
      </Col>
      <Col md={6}>

        <h2>Plan Dates</h2>

        <Table className="white-table">
          <thead>
            <tr>
              <th>Transaction Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {planDates.map((date) => (
              <tr key={uuidv4()}>
                <td>{date.transactionName}</td>
                <td>{date.amount}</td>
                <td>{formatDate(date.startDate)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>

    </Row>
  </div>
);
}
