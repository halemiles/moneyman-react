import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function TransactionCreate() {
    const [startDate, setStartDate] = useState(new Date());
    const [isAnticipatedSwitch, setAnticipatedSwitch] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.startDate = startDate;
        data.isAnticipated = isAnticipatedSwitch;

        fetch(serverUrl + "/transaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                navigate(`/transactionedit/${data.id}`);
            });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Form.Group controlId="formTransactionName">
                        <Form.Label>Transaction Name</Form.Label>
                        <Form.Control type="text" name="name" required />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formTransactionAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" name="amount" required />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formTransactionDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={startDate.toISOString().split("T")[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formIsAnticipated">
                        <Form.Check
                            type="switch"
                            label="Is Anticipated"
                            checked={isAnticipatedSwitch}
                            onChange={(e) => setAnticipatedSwitch(e.target.checked)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Button variant="primary" type="submit">
                Create Transaction
            </Button>
        </Form>
    );
}

export default TransactionCreate;