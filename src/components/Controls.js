// create a button to refresh data

//Path: src/components/Controls.js
import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import 'bootstrap/dist/css/bootstrap.min.css';

// refresh component to regather data

export default function Controls(props) {
    //const [url, setUrl] = useState("http://192.168.0.195:8600/dtp/current");
    const handleRefresh = (url) => {
        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            props.sendDataToParent(data.planDates);
        });
    };

    const refreshDataOnClick = () => {
        handleRefresh("http://192.168.0.195:8600/dtp/current");
    };

    const gatherCurrentOnClick = () => {
        //setUrl("http://192.168.0.195:8600/dtp/current");
        handleRefresh("http://192.168.0.195:8600/dtp/current");
    };

    const gatherFullOnClick = () => {
        //setUrl("http://192.168.0.195:8600/dtp/full");
        handleRefresh("http://192.168.0.195:8600/dtp/full");
    };

    return (
        <div>
            <Form.Group controlId="refresh" as={Row} className="mb-3">
                <Col sm="2">
                    <button onClick={refreshDataOnClick}>Refresh</button>
                    <button onClick={gatherFullOnClick}>Full</button>
                    <button onClick={gatherCurrentOnClick}>Current</button>
                </Col>
            </Form.Group>
        </div>
    );
}

