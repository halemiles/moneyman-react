
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import {handlePostRefresh} from "../../data/DutTillPayday.ts";
import { formatDateToMonthYear } from '../../logic/DateFormetting.js';

function BurndownChart() {
    const [planDates, setPlanDates] = useState([]);
    const startingAmount = 1234;
    let runningTotal = 0;


  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/full?startingvalue=1`, 500);
        console.log("planDates - ", plandates);

        let runningTotal = 0;
        let monthGroupedData = {};

        // First map the data and group by month
        plandates.planDates.forEach(pd => {
            runningTotal += pd.amount;

            const monthYear = formatDateToMonthYear(pd.date);

            if (!monthGroupedData[monthYear]) {
                monthGroupedData[monthYear] = {
                    name: monthYear,
                    amount: 0,
                };
            }

            monthGroupedData[monthYear].amount = (startingAmount - runningTotal);
        });

        // Convert the grouped data back to an array
        const mappedPlanDates = Object.values(monthGroupedData);

        setPlanDates(mappedPlanDates);
        console.log(mappedPlanDates);
    };

    fetchData();
}, []);



  return(
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={planDates} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3}/>
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  </ResponsiveContainer >
  );

};

export default BurndownChart;
