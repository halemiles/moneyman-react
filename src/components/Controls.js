import Form from 'react-bootstrap/Form';
import { useState } from 'react';

import Alert from 'react-bootstrap/Alert';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import {handlePostRefresh} from '../data/DutTillPayday';

export default function Controls(props) {

    const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

    // Current balance input is handled by the Summary component and passed via props

    const refreshDataOnClick = async () => {
        console.log("refreshDataOnClick");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, props.currentBalance);

        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const gatherCurrentOnClick = async () => {
        console.log("gatherCurrentOnClick");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, props.currentBalance);

        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const gatherFullOnClick = async () => {
        console.log("gatherFullOnClick");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/full?startingvalue=1`, props.currentBalance);

        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const generateOnClick = async () => {
        console.log("generateOnClick");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/generate`);
        console.log('generate data', data);
        if (data) {
            props.sendDataToParent(data.planDates);
            // show success notification
            setNotification({ show: true, message: 'Generation completed', variant: 'success' });
            // auto-hide after 3s
            setTimeout(() => setNotification(n => ({ ...n, show: false })), 3000);
            // refresh the table using existing handler
            await refreshDataOnClick();
        } else {
            // show failure notification
            setNotification({ show: true, message: 'Generation failed', variant: 'danger' });
            setTimeout(() => setNotification(n => ({ ...n, show: false })), 3000);
        }
    };

    const handleDropdown = async(e) => {

        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp?startingValue=1`, props.currentBalance, e.target.value);
        if(data) {
            props.sendDataToParent(data.planDates);
        }
    }

    return (
        <div>
            {notification.show && (
                <Alert variant={notification.variant} onClose={() => setNotification({ ...notification, show: false })} dismissible>
                    {notification.message}
                </Alert>
            )}
            {/* Current Balance input intentionally removed; Summary component owns this control and will notify parent */}
            <Form.Group controlId="refresh" as={Row} className="mb-3">
                <Col>
                    <Button className="me-2" variant={"success"} onClick={refreshDataOnClick}>Refresh</Button>
                    <Button className="me-2" variant={"success"} onClick={generateOnClick}>Generate</Button>
                    <Button className="me-2" variant={"secondary"} onClick={gatherFullOnClick}>Full</Button>
                    <Button className="me-2" variant={"secondary"} onClick={gatherCurrentOnClick}>From today</Button>
                </Col>
                <Col>
                    <select id="accountId" onChange={handleDropdown}>
                        <option value="0">All</option>
                        <option value="1">Natwest</option>
                        <option value="2">Starling</option>
                    </select>
                </Col>
            </Form.Group>
        </div>
    );
}
