import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DashboardCard from './cards/dashboard-card'
import DashboardSummaryCard from './cards/dashboard-card'
import {useEffect, useState} from 'react';

function DashboardTop() {
  const [actual, setActual] = useState(0);
    const [due, setDue] = useState(0);
  const [dashboardData, setDashboardData] = useState({tomorrow:"",today:"",yesterday:""});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dashboard/threedays`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
        setDashboardData({tomorrow:data.nextDates,today:data.today,yesterday:data.previousDates});
        console.log(dashboardData.tomorrow);
    });
  }, []);

  const handleActualChange = (e) => {
    setActual(e.target.value);
  };

  return (
    <Row xs={1} md={4} className="g-4">
      <Col key={"totalduemonthcard"}><DashboardCard subtitle={"Remaining"} title={"£100"} /></Col>
      <Col key={"yesterdaycard"}><DashboardSummaryCard items={dashboardData.yesterday} /></Col>
      <Col key={"todaycard"}><DashboardCard subtitle={"Today"} title={"This is a body"} /></Col>
      <Col key={"tomorrowcard"}><DashboardCard subtitle={"Yesterday"} title={"This is a body"} /></Col>

    </Row>
  );
}

export default DashboardTop;