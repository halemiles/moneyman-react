import {Table, Button, Form, Row, Col} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import { Frequency } from "../../models/Frequency";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function Transactions(){
    const [transactions, setTransactions] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [nameFilter, setNameFilter] = useState('');
    const [frequencyFilter, setFrequencyFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    useEffect(() => {
        fetch(`${serverUrl}/transaction`)
            .then((res) => res.json())
            .then((data) => setTransactions(data));
    }, []);

    const filtered = transactions.filter(t => {
        if (nameFilter && !t.name?.toLowerCase().includes(nameFilter.toLowerCase())) return false;
        if (frequencyFilter !== '' && String(t.frequency) !== frequencyFilter) return false;
        if (activeFilter === 'active' && !t.active) return false;
        if (activeFilter === 'inactive' && t.active) return false;
        return true;
    });

    function toggleSelect(id) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function toggleSelectAll() {
        if (filtered.every(t => selectedIds.has(t.id))) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                filtered.forEach(t => next.delete(t.id));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                filtered.forEach(t => next.add(t.id));
                return next;
            });
        }
    }

    function removeFromState(id) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }

    function deleteTransaction(id) {
        if (!window.confirm("Delete this transaction?")) return;
        fetch(`${serverUrl}/transaction/${id}`, { method: 'DELETE' })
            .then(response => { if (response.ok) removeFromState(id); });
    }

    async function deleteSelected() {
        if (selectedIds.size === 0) return;
        if (!window.confirm(`Delete ${selectedIds.size} transaction${selectedIds.size > 1 ? 's' : ''}?`)) return;
        for (const id of [...selectedIds]) {
            const response = await fetch(`${serverUrl}/transaction/${id}`, { method: 'DELETE' });
            if (response.ok) removeFromState(id);
        }
    }

    const allFilteredSelected = filtered.length > 0 && filtered.every(t => selectedIds.has(t.id));

    return (
        <div>
            <h1>Transactions</h1>
            <Row className="mb-2 g-2 align-items-end">
                <Col xs="auto">
                    <Form.Control
                        placeholder="Search by name..."
                        value={nameFilter}
                        onChange={e => setNameFilter(e.target.value)}
                    />
                </Col>
                <Col xs="auto">
                    <Form.Select value={frequencyFilter} onChange={e => setFrequencyFilter(e.target.value)}>
                        <option value="">All frequencies</option>
                        {Object.entries(Frequency).filter(([k]) => isNaN(Number(k))).map(([label, value]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs="auto">
                    <Form.Select value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Form.Select>
                </Col>
                <Col xs="auto">
                    <Button href="/transactioncreate">Add Transaction</Button>
                </Col>
                <Col xs="auto">
                    <Button variant="danger" disabled={selectedIds.size === 0} onClick={deleteSelected}>
                        Delete Selected ({selectedIds.size})
                    </Button>
                </Col>
            </Row>
            <Table className="white-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} /></th>
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
                    {filtered.map((transaction) => (
                        <tr key={transaction.id}>
                            <td><input type="checkbox" checked={selectedIds.has(transaction.id)} onChange={() => toggleSelect(transaction.id)} /></td>
                            <td>{transaction.name}</td>
                            <td>£{transaction.amount.toLocaleString()}</td>
                            <td>{new Date(transaction.startDate).toLocaleDateString()}</td>
                            <td>{transaction.active ? "✅" : ""}</td>
                            <td>{Frequency[transaction.frequency]}</td>
                            <td><a href={"/transactionedit/" + transaction.id} className="btn btn-primary">Edit</a></td>
                            <td><Button onClick={() => deleteTransaction(transaction.id)} className="btn-danger">Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Transactions;
