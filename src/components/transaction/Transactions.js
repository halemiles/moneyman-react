import {Table, Button} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import { Frequency } from "../../models/Frequency";


const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;
function Transactions(){
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/transaction`)
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
            });
    }, [serverUrl]);

    function deleteTransaction(id) {
        // ask user to confirm
        const userConfirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (!userConfirmed) {
            return;
        }


        fetch(`${serverUrl}/transaction/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            }
        })
    }


    return (
        <div>
            <h1>Transactions</h1>
            <Button href="/transactioncreate">Add Transaction</Button>
            <Table className="white-table">
                <thead>
                    <tr>
                        <th>Transaction Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Active</th>
                        <th>Frequency</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={uuidv4}>
                            <td>{transaction.name}</td>
                            <td>£{transaction.amount.toLocaleString()}</td>
                            <td>{new Date(transaction.startDate).toLocaleDateString()}</td>
                            <td>{transaction.active ? "✅" : ""}</td>
                            <td>{Frequency[transaction.frequency]}</td>
                        <td><a href={"/transactionedit/" + transaction.id} className="btn btn-primary">Edit</a></td>
                        <td><Button onClick={() => {deleteTransaction(transaction.id)}} className="btn-danger">Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </div>
    )
}

export default Transactions;
