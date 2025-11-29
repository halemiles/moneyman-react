import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import {handlePostRefresh} from '../data/DutTillPayday.ts';

export default function Controls(props) {

    // Local input state can be controlled by parent via props.currentBalance
    const handleBalanceChange = (e) => {
        const val = e.target.value;
        const num = val === '' ? null : Number(val);
        if (props.onCurrentBalanceChange) props.onCurrentBalanceChange(num);
    }

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

    const handleDropdown = async(e) => {

        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp?startingValue=1`, props.currentBalance, e.target.value);
        if(data) {
            props.sendDataToParent(data.planDates);
        }
    }

    return (
        <div>
            {/* Current Balance input intentionally removed; Summary component owns this control and will notify parent */}
            <Form.Group controlId="refresh" as={Row} className="mb-3">
                <Col>
                    <Button className="me-2" variant={"success"} onClick={refreshDataOnClick}>Refresh</Button>
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
