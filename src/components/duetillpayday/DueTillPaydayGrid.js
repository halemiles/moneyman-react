import React, { useState, useEffect, useMemo } from "react";
import Summary from '../Summary.js';
import Table from 'react-bootstrap/Table';
import Controls from '../Controls.js';
import '../Table.css'
import './DueTillPaydayGrid.css';
import {handlePostRefresh} from "../../data/DutTillPayday";
import {Row, Col, Card, ProgressBar} from 'react-bootstrap';
import { useTable, useSortBy } from 'react-table';
import { formatDateToMonthYear } from '../../logic/DateFormetting.js';
import { normalizePlanDates as _normalizePlanDates, parseTime, normalizeName, parseAmount, computeRemainingFromPlanDates, computeBurnRates } from './dtpHelpers.js';
import BalanceStaircase from './BalanceStaircase.js';




export default function DueTillPaydayGrid() {


  const [planDates, setPlanDates] = useState([]);

  const [startDate, setStartDate] = useState('-');
  // Keep both formatted display and raw end date for recalculation
  const [endDate, setEndDate] = useState('-');
  const [rawEndDate, setRawEndDate] = useState(null);
  const [rawStartDate, setRawStartDate] = useState(null);
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

  const handleMarkPaid = async (row) => {
    const item = row.original;
    const id = item.id;
    try {
      const response = await fetch(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/${id}/paid`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setPlanDates(prev => prev.filter(p => p !== item));
      } else {
        console.error('Mark paid failed', response.status);
      }
    } catch (err) {
      console.error('Mark paid error', err);
    }
  };

  const ActionCell = ({ row }) => (
    <div>
      <button type="button" className="btn btn-success btn-sm" onClick={() => handleMarkPaid(row)}>Mark Paid</button>
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
        setRawEndDate(plandates.endDate ?? plandates.enddate ?? null);
        setRawStartDate(plandates.startDate ?? plandates.startdate ?? null);

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

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const daysUntilPayday = useMemo(() => {
    if (!rawEndDate) return null;
    const end = new Date(rawEndDate);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  }, [rawEndDate, today]);

  const dueThisWeek = useMemo(() => {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return planDates.reduce((acc, item) => {
      if (!item.date) return acc;
      const d = new Date(item.date);
      d.setHours(0, 0, 0, 0);
      if (d >= today && d <= weekEnd) return acc + (Number(item.amount) || 0);
      return acc;
    }, 0);
  }, [planDates, today]);

  const overdueItems = useMemo(() =>
    planDates.filter(item => {
      if (!item.date) return false;
      const d = new Date(item.date);
      d.setHours(0, 0, 0, 0);
      return d < today;
    }), [planDates, today]);

  const periodProgress = useMemo(() => {
    if (!rawStartDate || !rawEndDate) return null;
    const start = new Date(rawStartDate); start.setHours(0,0,0,0);
    const end = new Date(rawEndDate); end.setHours(0,0,0,0);
    const total = end - start;
    if (total <= 0) return 100;
    const elapsed = Math.min(today - start, total);
    return Math.round((elapsed / total) * 100);
  }, [rawStartDate, rawEndDate, today]);

  const upcomingItems = useMemo(() =>
    planDates.filter(item => {
      if (!item.date) return false;
      const d = new Date(item.date); d.setHours(0,0,0,0);
      return d >= today;
    }), [planDates, today]);

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
     {periodProgress !== null && (
       <Row className="mb-3">
         <Col md={12}>
           <div className="d-flex justify-content-between mb-1 small text-muted">
             <span>{startDate}</span>
             <span>Today — {periodProgress}% through pay period</span>
             <span>{endDate}</span>
           </div>
           <ProgressBar now={periodProgress} label={`${periodProgress}%`} />
         </Col>
       </Row>
     )}
     <Row className="mb-3 g-3">
       <Col md={3}>
         <Card className="text-center h-100">
           <Card.Body>
             <div className="display-5 fw-bold">{daysUntilPayday ?? '—'}</div>
             <div className="text-muted">Days until payday</div>
           </Card.Body>
         </Card>
       </Col>
       <Col md={3}>
         <Card className="text-center h-100">
           <Card.Body>
             <div className="display-5 fw-bold">£{dueThisWeek.toFixed(0)}</div>
             <div className="text-muted">Due this week</div>
           </Card.Body>
         </Card>
       </Col>
       <Col md={3}>
         <Card className="text-center h-100">
           <Card.Body>
             <div className="display-5 fw-bold">£{burnPerDay}</div>
             <div className="text-muted">Safe daily spend</div>
             {daysUntilPayday > 0 && remainingAmount != null && (
               <div className="small text-muted mt-1">£{Math.round(remainingAmount)} ÷ {daysUntilPayday} days</div>
             )}
           </Card.Body>
         </Card>
       </Col>
       {overdueItems.length > 0 && (
         <Col md={3}>
           <Card className="text-center h-100 border-danger">
             <Card.Body>
               <div className="display-5 fw-bold text-danger">{overdueItems.length}</div>
               <div className="text-muted">Overdue items</div>
             </Card.Body>
           </Card>
         </Col>
       )}
       <Col md={3}>
         <Card className="text-center h-100">
           <Card.Body>
             <div className="display-5 fw-bold">{upcomingItems.length}</div>
             <div className="text-muted">Upcoming transactions</div>
           </Card.Body>
         </Card>
       </Col>
     </Row>
     <Row>
      <Col md={3}>
      <Summary
        planDates={planDates}
        currentBalance={currentBalance}
        onCurrentBalanceChange={setCurrentBalance}
      />
      </Col>
      <Col md={9}>
        <h2>Plan Dates</h2>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key: hgKey, ...hgProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={hgKey} {...hgProps}>
                  {headerGroup.headers.map((column) => {
                    const { key: colKey, ...colProps } = column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <th key={colKey} {...colProps}>
                        {column.render("Header")}
                        <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const itemDate = row.original.date ? new Date(row.original.date) : null;
              if (itemDate) itemDate.setHours(0, 0, 0, 0);
              const isOverdue = itemDate && itemDate < today;
              const { key: rowKey, ...rowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...rowProps} className={isOverdue ? 'table-warning' : ''}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return <td key={cellKey} {...cellProps}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
    <Row className="mt-4">
      <Col md={12}>
        <h5 className="text-muted mb-2">Projected balance to payday</h5>
        <BalanceStaircase
          planDates={planDates}
          currentBalance={currentBalance}
          rawEndDate={rawEndDate}
        />
      </Col>
    </Row>
  </div>
);
}
