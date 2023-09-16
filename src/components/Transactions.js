import {Table} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;
function Transactions(){
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch(serverUrl + "/transaction")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTransactions(data);
            });
    }, [serverUrl]);


    return(
        <div>
            <h1>Transactions</h1>
            <Table dark className="white-table">
                <thead>
                <tr>
                    <th>Transaction Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <tr key={uuidv4()}>
                        <td>{transaction.name}</td>
                        <td>{transaction.amount}</td>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td><a href={"/transaction/edit/" + transaction.id}>Edit</a></td>
                    </tr>
                ))}
                </tbody>
            </Table>

        </div>
    )
}

export default Transactions;