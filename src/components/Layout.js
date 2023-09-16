import React from "react";
import Grid from "./Grid";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Transactions from "./Transactions";
import Navigation from "./Navigation";
import "../App.css";

function Layout() {
  return (
    <div>
      <div className="ui center aligned container">
        <div className="wrapper">
          <h1>Money Manager</h1>
          <Navigation />
          <BrowserRouter>
            <Switch>
              <Route path="/home">
                <Grid />
              </Route>
              <Route path="/transaction">
                <Transactions />
              </Route>
              <Route path="/about">
                <About />
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
  </div>
);

export default Layout;
