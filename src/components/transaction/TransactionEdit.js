import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function TransactionEdit() {
    let { id } = useParams();
    const [startDate, setStartDate] = useState(new Date());
    const [transaction, setTransaction] = useState({});
    const [isAnticipatedSwitch, setAnticipatedSwitch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverUrl + "/transaction/" + id)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTransaction(data);
                setStartDate(data.date);
                setAnticipatedSwitch(data.isAnticipated ?? false);
            });
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.startDate = startDate;
        data.isAnticipated = isAnticipatedSwitch;

        fetch(serverUrl + "/transaction", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function handleDelete() {
        const userConfirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (userConfirmed) {
            fetch(`${serverUrl}/transaction/${transaction.id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    navigate('/transactions'); // Redirect to /transactions
                }
            })
            .catch(error => {
                console.error("Error during delete operation:", error);
            });
        }
    }

    return (
        <div>
            <h1>{transaction.name}</h1>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Id</Form.Label>
                        <Form.Control
                            required
                            id="id"
                            name="Id"
                            type="text"
                            placeholder="Id"
                            defaultValue={transaction.id}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            id="name"
                            name="Name"
                            type="text"
                            placeholder="Name"
                            defaultValue={transaction.name}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md="4" controlId="amount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            required
                            id="amount"
                            name="Amount"
                            type="text"
                            placeholder="Amount"
                            defaultValue={transaction.amount}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            required
                            id="startDate"
                            name="startDate"
                            type="string"
                            placeholder="Start Date"
                            defaultValue={startDate}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md="4">
                        <Form.Check
                            type="switch"
                            id="isAnticipatedSwitch"
                            name="isAnticipatedSwitch"
                            label="Is Anticipated"
                            checked={isAnticipatedSwitch}
                            onChange={(e) => setAnticipatedSwitch(e.target.checked)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button type="submit">Submit</Button>
                <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </Form>
        </div>
    );
}

export default TransactionEdit;