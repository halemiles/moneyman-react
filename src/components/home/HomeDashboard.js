import {Col, Row, Container} from "react-bootstrap";
import React, {useState} from "react";
import DashboardTop from "./dashboard-top";
import BurndownChart from "./burndown-chart";


function Transactions(){
    const [transactions, setTransactions] = useState([]);



    return(
        <div>
            <Container fluid>
                <h1>Dashboard</h1>
                <Row>
                    <Col>
                    <BurndownChart />
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <DashboardTop />
                    </Col>
                </Row>
            </Container>
            
        </div>
    )
}

export default Transactions;