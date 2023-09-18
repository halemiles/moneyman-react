import Nav from 'react-bootstrap/Nav';

function Navigation()
{
    return (        
        <Nav defaultActiveKey="/home" as="ul">
            <Nav.Item as="li">
                <Nav.Link href="/home">Home</Nav.Link>
            </Nav.Item>

            <Nav.Item as="li">
                <Nav.Link eventKey="/transactions">Transactions</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

export default Navigation;