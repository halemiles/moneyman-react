import React from "react";
import Grid from "./Grid";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import Routes instead of Switch
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
            <Routes> {/* Use Routes instead of Switch */}
              <Route path="/home" element={<Grid />} /> {/* Update Route definition */}
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

const About = () => (
  <div>
    <h1>About</h1>
  </div>
);

export default Layout;