import React, { useState, useEffect } from "react";
import Summary from './Summary';
import Table from 'react-bootstrap/Table';
import Controls from './Controls';
import './Table.css'
import { v4 as uuidv4 } from 'uuid';
import {handlePostRefresh} from "../data/DutTillPayday.ts";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;
export default function Grid() {
  const [planDates, setPlanDates] = useState([]);
  const [amountDue, setAmountDue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh('http://localhost:5000/dtp/current', 500);
        console.log("planDates - ", plandates);
        setPlanDates(plandates.planDates);
        setAmountDue(plandates.amountDue);
    };

    fetchData();
}, [serverUrl, handlePostRefresh]);
  const receiveDataFromChild = (data) => {
    setPlanDates(data);
  };

  const formatDate = (date) => {
    console.log(date);
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <Summary planDates={planDates} />
      <h2>Plan Dates</h2>

      <Controls sendDataToParent={receiveDataFromChild} />
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
    </div>
  );
}
