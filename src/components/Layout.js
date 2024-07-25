import React from "react";
import Grid from "./Grid";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Transactions from "./Transactions";
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
              <Route path="/home" element={<Grid />} />
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
