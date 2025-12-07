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
    const [frequency, setFrequency] = useState(0); // Default to Yearly
    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverUrl + "/transaction/" + id)
            .then((res) => res.json())
            .then((data) => {
                setTransaction(data);
                setStartDate(formatDateToYMD(data.startDate));
                setAnticipatedSwitch(data.isAnticipated ?? false);
                setFrequency(data.frequency ?? 0); // Set frequency from fetched data
            });
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.StartDate = startDate;
        data.IsAnticipated = isAnticipatedSwitch;
        data.Frequency = frequency; // Ensure frequency is sent as an integer

        fetch(serverUrl + "/transaction", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/transactions'); // Redirect to /transactions after save
                }
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
                    <Col md={8}> {/* Left column */}
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
                            <Form.Group as={Col} md="4">
                                <Form.Label>Frequency</Form.Label>
                                <Form.Control
                                    as="select"
                                    id="frequency"
                                    name="Frequency"
                                    value={frequency}
                                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                                >
                                    <option value="0">Yearly</option>
                                    <option value="1">Monthly</option>
                                    <option value="2">Weekly</option>
                                    <option value="3">Daily</option>
                                    <option value="4">Anticipated</option>
                                </Form.Control>
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
                    </Col>
                    <Col md={4}> {/* Right column */}
                        <Row>
                            <Form.Group as={Col} controlId="startDate" md="12">
                                <Form.Label>Start Date</Form.Label>
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
                    </Col>
                </Row>
                <Button type="submit">Submit</Button>
                <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </Form>
        </div>
    );
}

export default TransactionEdit;