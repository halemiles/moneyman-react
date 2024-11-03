import Card from 'react-bootstrap/Card';

const DashboardCard = ({title, subtitle}) => {
  return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                {subtitle}
                </Card.Subtitle>
            </Card.Body>
        </Card>
  );
}

export default DashboardCard;