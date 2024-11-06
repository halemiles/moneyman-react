import React, { useState, useEffect } from "react";
import Summary from '../Summary.js';
import Table from 'react-bootstrap/Table';
import Controls from '../Controls.js';
import '../Table.css'
import { v4 as uuidv4 } from 'uuid';
import {handlePostRefresh} from "../../data/DutTillPayday.ts";
import {Row, Col} from 'react-bootstrap';
import { useTable } from 'react-table';



export default function DueTillPaydayGrid() {


  const [planDates, setPlanDates] = useState([]);
  const columns = React.useMemo(
     () => [
      {
        Header: 'Name',
        accessor: 'transactionName', // accessor is the "key" in the data
        canSort: true

      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'PlanDate',
        accessor: 'date',
      }
    ],
    []
  )

  const data = React.useMemo(() => planDates, [])
  const tableInstance = useTable({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  useEffect(() => {
    const fetchData = async () => {
        const plandates = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, 500);
        console.log("planDates - ", plandates);
        setPlanDates(plandates.planDates);
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

                      <th {...column.getHeaderProps()}>
                        {
                          // Render the header

                          column.render("Header")
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>

          {/* Apply the table body props */}

          <tbody {...getTableBodyProps()}>
            {
              // Loop over the table rows

              rows.map((row) => {
                // Prepare the row for display

                prepareRow(row);

                return (
                  // Apply the row props

                  <tr {...row.getRowProps()}>
                    {
                      // Loop over the rows cells

                      row.cells.map((cell) => {
                        // Apply the cell props

                        return (
                          <td {...cell.getCellProps()}>
                            {
                              // Render the cell contents

                              cell.render("Cell")
                            }
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </Table>

      </Col>

    </Row>
  </div>
);
}
