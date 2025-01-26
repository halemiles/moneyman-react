import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/transaction`)
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
            });
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Transactions
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Transaction Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={uuidv4()}>
                                <TableCell>{transaction.name}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{new Date(transaction.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/transactionedit/${transaction.id}`} variant="contained" color="primary">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Transactions;