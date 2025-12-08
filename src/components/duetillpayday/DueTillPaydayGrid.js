import React, { useState, useEffect } from "react";
import Summary from '../Summary.js';
import Table from 'react-bootstrap/Table';
import Controls from '../Controls.js';
import '../Table.css'
import './DueTillPaydayGrid.css';
import {handlePostRefresh} from "../../data/DutTillPayday";
import {Row, Col} from 'react-bootstrap';
import { useTable, useSortBy } from 'react-table';
import { formatDateToMonthYear } from '../../logic/DateFormetting.js';
import { normalizePlanDates as _normalizePlanDates, parseTime, normalizeName, parseAmount, computeRemainingFromPlanDates, computeBurnRates } from './dtpHelpers.js';




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
  // Computed remaining after subtracting due items (currentBalance - totalDue)
  const [remainingAmount, setRemainingAmount] = useState(null);

  // Helper to ensure each plan date has a formattedDate property
  //  const normalizePlanDates = (items) => {
  //    if (!Array.isArray(items)) return [];
  //    return items.map(item => ({ ...item, formattedDate: formatDateToMonthYear(item.date) }));
  //  }
  // use extracted normalizePlanDates helper
  const normalizePlanDates = (items) => _normalizePlanDates(items);

  // Helper to compute total due between now and the provided end date (inclusive)
  //  const computeTotalDueUntil = (items, end) => {
  //    if (!Array.isArray(items) || items.length === 0) return 0;
  //    const endDateObj = end ? new Date(end) : null;
  //    const now = new Date();
  //    // normalize to midnight for comparisons
  //    if (endDateObj) endDateObj.setHours(0,0,0,0);
  //    now.setHours(0,0,0,0);
  //
  //    return items.reduce((acc, item) => {
  //      const itemDate = item && item.date ? new Date(item.date) : null;
  //      if (!itemDate) return acc;
  //      itemDate.setHours(0,0,0,0);
  //      // include items from today up to and including end date (if an end date is provided)
  //      const withinRange = (!endDateObj && itemDate >= now) || (endDateObj && itemDate >= now && itemDate <= endDateObj);
  //      if (!withinRange) return acc;
  //      const amt = Number(item.amount) || 0;
  //      return acc + amt;
  //    }, 0);
  //  }
  // use computeTotalDueUntil from helpers when needed

  // Helper to compute remaining: (currentBalance - totalDueUntilEnd)
  //  const computeRemainingFromPlanDates = (balance, items, end) => {
  //    const bal = Number(balance ?? 0) || 0;
  //    const totalDue = computeTotalDueUntil(items, end);
  //    return bal - totalDue;
  //  }
  // use computeRemainingFromPlanDates from helpers when needed

  // Handler used by the action Cell in the table columns; declare before columns so it's available
  const handleHide = (row) => {
    const originalItem = row.original;

    // Use shared helpers (parseTime, normalizeName, parseAmount) for matching

    // Use functional update to avoid stale closures and ensure we operate on latest state
    setPlanDates(prev => {
      // Try identity first (fast and exact)
      let idx = prev.findIndex(item => item === originalItem);


      const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];


      return next;
    });
  }

  // Named cell renderer so static analyzers don't flag the inline property as unused
  const ActionCell = ({ row }) => (
    <div>
      <button type="button" className="btn btn-secondary" onClick={() => handleHide(row)}>Hide</button>
    </div>
  );

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
        Cell: ActionCell,
      }
     ],
     []
   )

  const data = React.useMemo(() => planDates, [planDates]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, initialState: { sortBy: [{ id: 'formattedDate', desc: false }] } }, useSortBy);

  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, 500);
        console.log("planDates - ", plandates);
        setPlanDates(normalizePlanDates(plandates.planDates));
        setStartDate(formatDateToMonthYear(plandates.startDate));
        setEndDate(formatDateToMonthYear(plandates.endDate));
        // Save raw end date for recalculation
        setRawEndDate(plandates.endDate ?? plandates.enddate ?? null);

        // Determine remaining amount preference: if the API supplies a remaining value use it, otherwise compute remaining as (currentBalance - total due)
        const apiRemainingCandidate = plandates.remainingAmount ?? plandates.remaining ?? plandates.remainingBalance ?? plandates.remaining_amount ?? plandates.remainingAmt ?? plandates.remainingAmtInPence ?? null;
        const apiRemaining = apiRemainingCandidate != null ? Number(apiRemainingCandidate) : NaN;
        let remainingToUse;
        if (!isNaN(apiRemaining)) {
          remainingToUse = apiRemaining;
        } else {
          // compute remaining by subtracting planned dues up to the end date from the current balance
          remainingToUse = computeRemainingFromPlanDates(currentBalance ?? 0, plandates.planDates ?? [], plandates.endDate ?? plandates.enddate ?? null);
        }

        // persist the remaining value we used so the UI can show it and we can recompute from it
        setRemainingAmount(remainingToUse);

        const rates = computeBurnRates(remainingToUse, plandates.endDate ?? plandates.enddate ?? null);
        setBurnPerWeek(rates.burnPerWeek);
        setBurnPerDay(rates.burnPerDay);
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
    const remaining = computeRemainingFromPlanDates(currentBalance ?? 0, planDates ?? [], rawEndDate);
    setRemainingAmount(remaining);
    const rates = computeBurnRates(remaining, rawEndDate);
    setBurnPerWeek(rates.burnPerWeek);
    setBurnPerDay(rates.burnPerDay);
  }
}, [currentBalance, rawEndDate]);

// Also recompute when planDates change (e.g., user switches accounts or the plan updates)
useEffect(() => {
  if (rawEndDate) {
    const remaining = computeRemainingFromPlanDates(currentBalance ?? 0, planDates ?? [], rawEndDate);
    setRemainingAmount(remaining);
    const rates = computeBurnRates(remaining, rawEndDate);
    setBurnPerWeek(rates.burnPerWeek);
    setBurnPerDay(rates.burnPerDay);
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
      <Summary
        planDates={planDates}
        currentBalance={currentBalance}
        onCurrentBalanceChange={setCurrentBalance}
        startDate={startDate}
        endDate={endDate}
        burnPerWeek={burnPerWeek}
        burnPerDay={burnPerDay}
      />
      </Col>
      <Col md={9}>
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
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
  </div>
);
}
