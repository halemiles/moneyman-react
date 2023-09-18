import {Col, Row, Container} from "react-bootstrap";
import Navigation from "./Navigation";

function Header() {
    return (
        <div>
            <Container fluid="md"><Row>
                <Col><h1>Money Manager</h1></Col>
                <Col><Navigation /></Col>
            </Row>
            </Container>
        </div>
)};

export default Header;