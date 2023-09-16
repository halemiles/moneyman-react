import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Controls(props) {
    const handleRefresh = (url) => {
        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            props.sendDataToParent(data.planDates);
        });
    };

    const refreshDataOnClick = () => {
        handleRefresh("http://192.168.0.195:8600/dtp/current");
    };

    const gatherCurrentOnClick = () => {
        handleRefresh("http://192.168.0.195:8600/dtp/current");
    };

    const gatherFullOnClick = () => {
        handleRefresh("http://192.168.0.195:8600/dtp/full");
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

