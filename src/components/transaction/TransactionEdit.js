import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import {formatDateToYMD} from '../../logic/DateFormetting';

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function TransactionEdit() {
    let { id } = useParams();
    const [startDate, setStartDate] = useState("");
    const [transaction, setTransaction] = useState({});
    const [isAnticipatedSwitch, setAnticipatedSwitch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverUrl + "/transaction/" + id)
            .then((res) => res.json())
            .then((data) => {
                setTransaction(data);
                setStartDate(formatDateToYMD(data.startDate));
                setAnticipatedSwitch(data.isAnticipated ?? false);
            });
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.StartDate = startDate;
        data.IsAnticipated = isAnticipatedSwitch;

        fetch(serverUrl + "/transaction", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
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
                            id="id"
                            name="Id"
                            type="text"
                            placeholder="Id"
                            required
                            defaultValue={transaction.id}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            id="name"
                            name="Name"
                            type="text"
                            placeholder="Name"
                            required
                            defaultValue={transaction.name}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} controlId="amount" md="4">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            id="amount"
                            name="Amount"
                            type="text"
                            placeholder="Amount"
                            required
                            defaultValue={transaction.amount}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                <Form.Group as={Col} controlId="startDate" md="12">
                <Form.Label>Amount</Form.Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            id="startDate"
                            name="startDate"
                            type="text"
                            required
                            value={dayjs(startDate)}
                            onChange={(e) => setStartDate(formatDateToYMD(e))}
                        />
                    </LocalizationProvider>
                </Form.Group>


                </Row>
                <Row>
                    <Form.Group as={Col} md="4">
                        <Form.Check
                            id="isAnticipatedSwitch"
                            name="isAnticipatedSwitch"
                            type="switch"
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