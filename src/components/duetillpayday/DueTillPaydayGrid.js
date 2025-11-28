import React, { useState, useEffect } from "react";
import Summary from '../Summary.js';
import Table from 'react-bootstrap/Table';
import Controls from '../Controls.js';
import '../Table.css'
import { v4 as uuidv4 } from 'uuid';
import {handlePostRefresh} from "../../data/DutTillPayday.ts";
import {Row, Col} from 'react-bootstrap';
import { useTable, useSortBy } from 'react-table';
import { formatDateToMonthYear } from '../../logic/DateFormetting.js';



export default function DueTillPaydayGrid() {


  const [planDates, setPlanDates] = useState([]);

  const [startDate, setStartDate] = useState('-');
  const [endDate, setEndDate] = useState('-');
  const [spendPerWeek, setSpendPerWeek] = useState(0);
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
        Header: 'PlanDate',
        accessor: 'date'
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: row => (
          <div>
             <button onClick={e=> handleEdit(row.row.index)}>Edit</button>
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
  } = useTable({ columns, data }, useSortBy);

  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, 500);
        console.log("planDates - ", plandates);
        setPlanDates(plandates.planDates);
        setStartDate(formatDateToMonthYear(plandates.startDate));
        setEndDate(formatDateToMonthYear(plandates.endDate));
        setSpendPerWeek(plandates.spendPerWeek.toFixed(2));
        console.log(plandates.planDates);

    };

    fetchData();
}, []);
  const receiveDataFromChild = async (data) => {
    console.log("Setting plan date child data", await data)
    setPlanDates(await data);
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
      <Summary planDates={planDates} />

      <p>Start Date: {startDate}</p>
        <p>End Date: {endDate}</p>
        <p>Burn Rate: {spendPerWeek}</p>
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
              (row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )}
            )}
          </tbody>
        </Table>

      </Col>

    </Row>
  </div>
);
}
