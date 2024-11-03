import Card from 'react-bootstrap/Card';

const DashboardSummaryCard = ({items}) => {
  return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>Summary card</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                {items.map((item) => {
                  return item.transactionName
                })}
                </Card.Subtitle>
            </Card.Body>
        </Card>
  );
}

export default DashboardSummaryCard;