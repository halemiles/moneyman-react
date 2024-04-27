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
            }
        );
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data);
        axios.put(serverUrl + "/transaction/", {
            body: data
        }).then((res) => {
            console.log(res);
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
                    <Form.Group as={Col} md="4" controlId="id">
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
                    <Form.Group as={Col} md="4" controlId="name">
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
                    <Form.Group as={Col} md="4" controlId="startDate" >
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            required
                            id="startDate"
                            name="Date"
                            type="string"
                            placeholder="Start Date"
                            defaultValue={startDate}
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