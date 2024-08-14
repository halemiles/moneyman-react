import Card from 'react-bootstrap/Card';

const DayTransactions = ({title, body}) => {
  return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                {body}
                </Card.Text>
            </Card.Body>
        </Card>
  );
}

export default DayTransactions;