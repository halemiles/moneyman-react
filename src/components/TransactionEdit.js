import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useState} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function TransactionEdit()
{
    let id = useParams().id;
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
            }
        );
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data);
        fetch(serverUrl + "/transaction/" + id, {
            method: 'PUT',
            body: data,
        });
    }

    return (
        <div>
            <h1>{transaction.name}</h1>
            


             <Form onSubmit={handleSubmit}>
                

                <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            required
                            id="amount"
                            name="amount"
                            type="text"
                            placeholder="Amount"
                            defaultValue={transaction.amount}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            required
                            id="date"
                            name="date"
                            type="date"
                            placeholder="Start Date"
                            defaultValue={transaction.startDate}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
            
                 <button>Submit</button>
             </Form>
            

        </div>
    );
}

export default TransactionEdit;