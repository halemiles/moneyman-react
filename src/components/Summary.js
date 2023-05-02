import React, { useState, useEffect } from "react";

export default function Summary(props) {
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
      let sum = 0;
      props.planDates.forEach((pd) => {
        sum += pd.amount || 0;
      });
      setTotalAmount(parseFloat(sum.toFixed(2)));
    }, [props.planDates]);

  return (
    <div>
      <h2>Summary</h2>
      <div>
        Due: {totalAmount}
      </div>
    </div>
  );
}
