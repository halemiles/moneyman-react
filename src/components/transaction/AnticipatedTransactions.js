import {Table, Button} from "react-bootstrap";
import React, {useState} from "react";
import { useTransactionFetcher } from "../../logic/transactionFetcher";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function AnticipatedTransactions() {
    const { transactions, setTransactions } = useTransactionFetcher({ anticipated: true });
    const [selectedIds, setSelectedIds] = useState(new Set());

    function toggleSelect(id) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function toggleSelectAll() {
        if (selectedIds.size === transactions.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(transactions.map(t => t.id)));
        }
    }

    function removeFromState(id) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }

    function deleteTransaction(id) {
        if (!window.confirm("Delete this transaction?")) return;
        fetch(`${serverUrl}/transaction/${id}`, { method: 'DELETE' })
            .then(response => { if (response.ok) removeFromState(id); })
            .catch(err => console.error('Delete failed', err));
    }

    async function deleteSelected() {
        if (selectedIds.size === 0) return;
        if (!window.confirm(`Delete ${selectedIds.size} transaction${selectedIds.size > 1 ? 's' : ''}?`)) return;
        for (const id of [...selectedIds]) {
            const response = await fetch(`${serverUrl}/transaction/${id}`, { method: 'DELETE' });
            if (response.ok) removeFromState(id);
        }
    }

    const allSelected = transactions.length > 0 && selectedIds.size === transactions.length;

    return (
        <div>
            <h1>Anticipated Transactions</h1>
            <div className="d-flex gap-2 mb-2">
                <Button href="/transactioncreate">Add Transaction</Button>
                <Button variant="danger" disabled={selectedIds.size === 0} onClick={deleteSelected}>
                    Delete Selected ({selectedIds.size})
                </Button>
            </div>
            <Table className="white-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} /></th>
                        <th>Transaction Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td><input type="checkbox" checked={selectedIds.has(transaction.id)} onChange={() => toggleSelect(transaction.id)} /></td>
                            <td>{transaction.name}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.startDate ? new Date(transaction.startDate).toLocaleDateString() : (transaction.date ? new Date(transaction.date).toLocaleDateString() : '')}</td>
                            <td><a href={"/transactionedit/" + transaction.id}>Edit</a></td>
                            <td><Button onClick={() => deleteTransaction(transaction.id)}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AnticipatedTransactions;
