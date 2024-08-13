import React from "react";
import DueTillPaydayGrid from "./duetillpayday/DueTillPaydayGrid";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeDashboard from './home/HomeDashboard'
import Transactions from "./transaction/Transactions";
import Header from "./Header";
import TransactionEdit from "./transaction/TransactionEdit";
import "../App.css";

function Layout() {
  return (
    <div>
      <div className="ui center aligned container">
        <div>
          <Header />
          <BrowserRouter>
            <Routes>
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/duetillpayday" element={<DueTillPaydayGrid />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/about" element={<About />} />
              <Route path="/transactionedit/:id" element={<TransactionEdit />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

// Create About component. Include h1 tag with text.
const About = () => (
  <div>
    <h1>About</h1>
    <h2>
      This is a simple application that allows you to create and edit transactions.
    </h2>
  </div>
);

export default Layout;
