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

    const refreshDataOnClick = () => {
        props.sendDataToParent(handlePostRefresh("http://localhost:5000/dtp/current", props.currentBalance).PlanDates);
    };

    const gatherCurrentOnClick = () => {
        props.sendDataToParent(handlePostRefresh("http://localhost:5000/dtp/current", props.currentBalance).PlanDates);
    };

    const gatherFullOnClick = () => {
        props.sendDataToParent(handlePostRefresh("http://localhost:5000/dtp/full", props.currentBalance).PlanDates);
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

