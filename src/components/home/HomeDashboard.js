import {Col, Row, Container} from "react-bootstrap";
import React, {useState} from "react";
import DashboardTop from "./dashboard-top";
import BurndownChart from "./burndown-chart";


function Transactions(){

    return(
        <div>
                <h2>Dashboard</h2>
                <Row>
                    <Col>
                    <DashboardTop />
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <BurndownChart />
                    </Col>
                </Row>

        </div>
    )
}

export default Transactions;