import {useEffect} from "react";
import {useParams} from "react-router-dom/cjs/react-router-dom.min";
import {useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import axios from "axios";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function TransactionEdit()
{
    let id = useParams().id;
    const [startDate, setStartDate] = useState(new Date());//["", function(){}
    const [transaction, setTransaction] = useState({});//[{}, function(){}
    const [isAnticipatedSwitch, setAnticipatedSwitch] = useState(false);//[{}, function(){}

    //fetch transaction by id
    //populate form with transaction data
    //submit form to update transaction

    useEffect(() => {
        fetch(serverUrl + "/transaction/" + id)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTransaction(data);
                setStartDate(data.date);
                setAnticipatedSwitch(data.isAnticipated ?? false);
            }
        );
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.startDate = '2024-06-01';
        console.log(isAnticipatedSwitch);
        data.isAnticipated = isAnticipatedSwitch;
        console.log(JSON.stringify(data));
        fetch(serverUrl + "/transaction/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function formatDate(dateString) {
        console.log(dateString);
        const inputDate = new Date(dateString);

        // // Check if the input date is valid
        // if (isNaN(inputDate.getTime())) {
        //     throw new Error('Invalid date');
        // }

        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(inputDate.getDate()).padStart(2, '0');

        var convertedDate = `${year}-${month}-${day}`;
        console.log(convertedDate);
        return convertedDate;
    }


    return (
        <div>
            <h1>{transaction.name}</h1>
             <Form onSubmit={handleSubmit}>
             <Row>
                    <Form.Group as={Col} md="4" >
                        <Form.Label>Amount</Form.Label>
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
                    <Form.Group as={Col} md="4" >
                        <Form.Label>Amount</Form.Label>
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
                    <Form.Group as={Col} md="4" >
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
                    <Form.Group as={Col} md="4" >
                        <Form.Check // prettier-ignore
                            type="switch"
                            id="isAnticipatedSwitch"
                            name="isAnticipatedSwitch"
                            label="Is Anticipated"
                            checked={isAnticipatedSwitch}
                            onChange={(e) => {console.log(e.target.checked); setAnticipatedSwitch(e.target.checked)}}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>

                 <Button type="submit">Submit</Button>
             </Form>
        </div>
    );
}

export default TransactionEdit;