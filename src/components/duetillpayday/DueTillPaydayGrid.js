import React, { useState, useEffect } from "react";
import Summary from '../Summary.js';
import Table from 'react-bootstrap/Table';
import Controls from '../Controls.js';
import '../Table.css'
import {handlePostRefresh} from "../../data/DutTillPayday";
import {Row, Col} from 'react-bootstrap';
import { useTable, useSortBy } from 'react-table';
import { formatDateToMonthYear } from '../../logic/DateFormetting.js';




export default function DueTillPaydayGrid() {


  const [planDates, setPlanDates] = useState([]);

  const [startDate, setStartDate] = useState('-');
  // Keep both formatted display and raw end date for recalculation
  const [endDate, setEndDate] = useState('-');
  const [rawEndDate, setRawEndDate] = useState(null);
  // New: store both weekly and daily burn rates
  const [burnPerWeek, setBurnPerWeek] = useState(0);
  const [burnPerDay, setBurnPerDay] = useState(0);
  // Current balance (editable by user via Controls)
  const [currentBalance, setCurrentBalance] = useState(null);

  // Helper to ensure each plan date has a formattedDate property
  const normalizePlanDates = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({ ...item, formattedDate: formatDateToMonthYear(item.date) }));
  }

  /** @type {any[]} */
  const columns = React.useMemo(
     () => [
      {
        Header: 'Name',
        accessor: 'transactionName', // accessor is the "key" in the data
        sortType: 'basic'
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Plan Date',
        accessor: 'formattedDate',
        // Sort by the underlying date (original.date) to ensure chronological ordering
        sortType: (rowA, rowB) => {
          const a = Date.parse(rowA.original.date) || 0;
          const b = Date.parse(rowB.original.date) || 0;
          return a - b;
        }
      },
      {
        Header: 'Action',
        id: 'action',
        Cell: row => (
          <div>
             <button onClick={() => handleEdit(row.row.index)}>Edit</button>
          </div>
          ),
      }
    ],
    []
  )

  const handleEdit = (original) => {
    console.log(original);
    setPlanDates(planDates.filter((v, i) => i !== original));
  }

  const data = React.useMemo(() => planDates, [planDates]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, initialState: { sortBy: [{ id: 'formattedDate', desc: false }] } }, useSortBy);

  // Helper to compute burn rates from remaining (or balance) and end date
  const computeBurnRates = (remainingValue, end) => {
    const remaining = Number(remainingValue ?? 0) || 0;
    if (!end || isNaN(new Date(end).getTime())) {
      setBurnPerWeek(0);
      setBurnPerDay(0);
      return;
    }

    const endDateObj = new Date(end);
    const msPerDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const rawDays = Math.ceil((new Date(endDateObj.setHours(0,0,0,0)) - new Date(now.setHours(0,0,0,0))) / msPerDay);
    const daysRemaining = Math.max(rawDays, 0);
    const weeksRemaining = Math.max(Math.ceil(daysRemaining / 7), 1);
    const daysForCalc = Math.max(daysRemaining, 1);

    const weekly = Math.floor(remaining / weeksRemaining);
    const daily = Math.floor(remaining / daysForCalc);

    setBurnPerWeek(weekly);
    setBurnPerDay(daily);
  }

  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, 500);
        console.log("planDates - ", plandates);
        setPlanDates(normalizePlanDates(plandates.planDates));
        setStartDate(formatDateToMonthYear(plandates.startDate));
        setEndDate(formatDateToMonthYear(plandates.endDate));
        // Save raw end date for recalculation
        setRawEndDate(plandates.endDate ?? plandates.enddate ?? null);

        // Determine remaining amount preference: if the API supplies a remaining value use it, otherwise fall back to currentBalance if set
        const apiRemaining = Number(plandates.remainingAmount ?? plandates.remaining ?? plandates.remainingBalance ?? plandates.remaining_amount ?? plandates.remainingAmt ?? plandates.remainingAmtInPence ?? null);
        const remainingToUse = !isNaN(apiRemaining) && apiRemaining !== null ? apiRemaining : (currentBalance ?? 0);

        computeBurnRates(remainingToUse, plandates.endDate ?? plandates.enddate ?? null);
        console.log(plandates.planDates);

    };

    fetchData();
}, []);

// Recompute burn rates when the current balance changes (so the UI updates immediately)
useEffect(() => {
  // If API provided a specific remaining value we prefer that and do not override; otherwise use currentBalance
  // Here we attempt to read remaining from the last fetched planDates via rawEndDate and planDates state isn't directly giving remaining, so we re-call the API outcome's field where possible.
  // Simplify: recompute using currentBalance and rawEndDate; if API provided a remaining and it's different you can click Refresh to re-fetch.
  if (rawEndDate) {
    computeBurnRates(currentBalance ?? 0, rawEndDate);
  }
}, [currentBalance, rawEndDate]);

// Also recompute when planDates change (e.g., user switches accounts or the plan updates)
useEffect(() => {
  if (rawEndDate) {
    computeBurnRates(currentBalance ?? 0, rawEndDate);
  }
}, [planDates, rawEndDate]);

  const receiveDataFromChild = async (data) => {
    const incoming = await data;
    console.log("Setting plan date child data", incoming)
    setPlanDates(normalizePlanDates(incoming));
  };


 return (
   <div>
     <Row>
     <Col md={12}>
        <Controls sendDataToParent={receiveDataFromChild} />
     </Col>
     </Row>
     <Row>
      <Col md={3}>
      <Summary planDates={planDates} currentBalance={currentBalance} onCurrentBalanceChange={setCurrentBalance} />

      <p>Start Date: {startDate}</p>
        <p>End Date: {endDate}</p>
        <p>Burn Rate (weekly): £{burnPerWeek}</p>
        <p>Burn Rate (daily): £{burnPerDay}</p>
      </Col>
      <Col md={6}>
        <h2>Plan Dates</h2>
        <Table {...getTableProps()}>
          <thead>
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column) => (
                      // Apply the header cell props
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {
                          // Render the header
                          column.render("Header")
                        }
                        <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                        </span>
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>

          {/* Apply the table body props */}

          <tbody {...getTableBodyProps()}>
            {rows.map(
              (row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
            })}
          </tbody>
        </Table>

      </Col>

    </Row>
  </div>
);
}
