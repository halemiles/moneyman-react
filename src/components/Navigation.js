import { Navbar, Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';

function Navigation() {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="#home">Money Manager</Navbar.Brand>
                <Nav defaultActiveKey="/" as="ul">
                    <Nav.Item as="li">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <Nav.Link href="/transactions">Transactions</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <Nav.Link href="/anticipatedtransactions">Anticipated Transactions</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Navigation;