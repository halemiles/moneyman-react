import React, { useState, useEffect } from "react";
import Summary from './Summary';
import Table from 'react-bootstrap/Table';
import './Table.css'

export default function Grid() {
  const [planDates, setPlanDates] = useState([]);
  const [amountDue, setAmountDue] = useState(0);

  useEffect(() => {
    fetch("http://192.168.0.195:8600/dtp/current")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPlanDates(data.planDates);
        setAmountDue(data.amountDue);
      });
  }, []);

  return (
    <div>
      <Summary planDates={planDates} />
      <h2>Plan Dates</h2>
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
            <tr key={date.date}>
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
