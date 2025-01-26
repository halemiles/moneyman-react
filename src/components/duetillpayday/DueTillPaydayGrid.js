import React, { useState, useEffect } from "react";
import Summary from '../Summary.js';
import Controls from '../Controls.js';
import { v4 as uuidv4 } from 'uuid';
import { handlePostRefresh } from "../../data/DutTillPayday.ts";
import { Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import '../Table.css';

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
    console.log("Setting plan date child data", await data);
    setPlanDates(await data);
  };

  const formatDate = (date) => {
    console.log(date);
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controls sendDataToParent={receiveDataFromChild} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Summary planDates={planDates} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="h4" gutterBottom>
            Plan Dates
          </Typography>
          <TableContainer component={Paper}>
            <Table className="white-table">
              <TableHead>
                <TableRow>
                  <TableCell>Transaction Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planDates.map((date) => (
                  <TableRow key={uuidv4()}>
                    <TableCell>{date.transactionName}</TableCell>
                    <TableCell>{date.amount}</TableCell>
                    <TableCell>{formatDate(date.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}
