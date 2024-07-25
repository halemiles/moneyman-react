import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import {handlePostRefresh} from '../data/DutTillPayday.ts';

export default function Controls(props) {




    // const handleRefresh = (url) => {
    //     fetch(url)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         props.sendDataToParent(data.payload.planDates);
    //     });
    // };

    const refreshDataOnClick = async () => {
        console.log("Getting data");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, props.currentBalance);
        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const gatherCurrentOnClick = async () => {
        console.log("Getting data");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, props.currentBalance);
        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const gatherFullOnClick = async () => {
        console.log("Getting data");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/full?startingvalue=1`, props.currentBalance);
        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    return (
        <div>
            <Form.Group controlId="refresh" as={Row} className="mb-3">
                <Col>
                    <Button className="me-2" variant={"success"} onClick={refreshDataOnClick}>Refresh</Button>
                    <Button className="me-2" variant={"secondary"} onClick={gatherFullOnClick}>Full</Button>
                    <Button className="me-2" variant={"secondary"} onClick={gatherCurrentOnClick}>From today</Button>
                </Col>
            </Form.Group>
        </div>
    );
}

