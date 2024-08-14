
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import {handlePostRefresh} from "../../data/DutTillPayday.ts";


function BurndownChart() {
    const [planDates, setPlanDates] = useState([]);
    const startingAmount = 1234;
    let runningTotal = 0;
    useEffect(() => {
        const fetchData = async () => {
            const plandates = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/full?startingvalue=1`, 500);
            console.log("planDates - ", plandates);
            let mappedPlanDates = plandates.planDates.map(pd => {
                    runningTotal += pd.amount;
                    return {
                    name: pd.date,
                    uv: (startingAmount - runningTotal),
                    pv: startingAmount,
                    amt: startingAmount,
                }
            });
            setPlanDates(mappedPlanDates);
            console.log(plandates.planDates);
        };

        fetchData();
    }, []);



  return(
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={planDates} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  </ResponsiveContainer >
  );

};

export default BurndownChart;
