import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TotalDueMonth from './cards/total-due-month'
import DayTransactions from './cards/day-transactions'

function DashboardTop() {
  return (
    <Row xs={1} md={4} className="g-4">
      <Col key={"totalduemonthcard"}><TotalDueMonth /></Col>
      <Col key={"yesterdaycard"}><DayTransactions title={"Yesterday"} body={"This is a body"} /></Col>
      <Col key={"todaycard"}><DayTransactions title={"Today"} body={"This is a body"} /></Col>
      <Col key={"tomorrowcard"}><DayTransactions title={"Tomorrow"} body={"This is a body"} /></Col>

    </Row>
  );
}

export default DashboardTop;