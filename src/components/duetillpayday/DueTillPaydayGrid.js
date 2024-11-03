import React, { useState, useEffect } from "react";
import Summary from '../Summary.js';
import Table from 'react-bootstrap/Table';
import Controls from '../Controls.js';
import '../Table.css'
import { v4 as uuidv4 } from 'uuid';
import {handlePostRefresh} from "../../data/DutTillPayday.ts";
import {Row, Col} from 'react-bootstrap';

export default function DueTillPaydayGrid() {
  const [planDates, setPlanDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, 500);
        console.log("planDates - ", plandates);
        setPlanDates(plandates.planDates);
        console.log(plandates.planDates);
    };

    fetchData();
}, []);
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
                <td>{formatDate(date.date)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>

    </Row>
  </div>
);
}
