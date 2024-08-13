import {Navbar} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';

function Navigation()
{
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Navbar.Brand href="#home">Money Manager</Navbar.Brand>
            <Nav defaultActiveKey="/home" as="ul" >
                <Nav.Item as="li">
                    <Nav.Link href="/home">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                    <Nav.Link href="/duetillpayday">Due Till Payday</Nav.Link>
                </Nav.Item>

                <Nav.Item as="li">
                    <Nav.Link href="/transactions">Transactions</Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}

export default Navigation;