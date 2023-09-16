import React, { useState, useEffect } from "react";
import Summary from './Summary';
import Table from 'react-bootstrap/Table';
import Controls from './Controls';
import './Table.css'
import { v4 as uuidv4 } from 'uuid';

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;
export default function Grid() {
  const [planDates, setPlanDates] = useState([]);
  const [amountDue, setAmountDue] = useState(0);

  useEffect(() => {
    
    fetch(serverUrl + "/dtp/current")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPlanDates(data.planDates);
        setAmountDue(data.amountDue);
      });
  }, [serverUrl]);

  const receiveDataFromChild = (data) => {
    console.log(serverUrl);
    setPlanDates(data);
  };

  return (
    <div>
      <Summary planDates={planDates} />
      <h2>Plan Dates</h2>

      <Controls sendDataToParent={receiveDataFromChild} />
      <Table dark className="white-table">
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
              <td>{new Date(date.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Amount Due: ${amountDue}</h2>
    </div>
  );
}
