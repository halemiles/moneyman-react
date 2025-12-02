import {Table, Button} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;
function AnticipatedTransactions(){
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch(`${serverUrl}/transaction?anticipated=true`)
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
            })
            .catch((err) => {
                console.error('Failed to load anticipated transactions', err);
            });
    }, [serverUrl]);

    function deleteTransaction(id) {
        const userConfirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (!userConfirmed) {
            return;
        }

        fetch(`${serverUrl}/transaction/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // remove locally without full reload for a better UX
                setTransactions(prev => prev.filter(t => t.id !== id));
            }
        })
        .catch(err => console.error('Delete failed', err));
    }

    return (
        <div>
            <h1>Anticipated Transactions</h1>
            <Button href="/transactioncreate">Add Transaction</Button>
            <Table className="white-table">
                <thead>
                    <tr>
                        <th>Transaction Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((transaction) => (
                        <tr key={uuidv4()}>
                            <td>{transaction.name}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.startDate ? new Date(transaction.startDate).toLocaleDateString() : (transaction.date ? new Date(transaction.date).toLocaleDateString() : '')}</td>
                            <td><a href={"/transactionedit/" + transaction.id}>Edit</a></td>
                            <td><Button onClick={() => {deleteTransaction(transaction.id)}}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </div>
    )
}

export default AnticipatedTransactions;

