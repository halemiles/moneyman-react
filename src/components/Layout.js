import React from "react";
import Grid from "./Grid";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Transactions from "./Transactions";
import Header from "./Header";
import TransactionEdit from "./transaction/TransactionEdit";
import "../App.css";

function Layout() {
  

  return (
    <div>
      <div className="ui center aligned container">
        <div >
          
          <Header />
          <BrowserRouter>
            <Switch>
              <Route path="/home">
                <Grid />
              </Route>
              <Route path="/transactions">
                <Transactions />
                
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/transactionedit/:id">
                <TransactionEdit />
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

// create about component. include h1 tag with text.

const About = () => (
  <div>
    <h1>About</h1>
    <h2>
      This is a simple application that allows you to create and edit transactions.
    </h2>
  </div>
);


export default Layout;
