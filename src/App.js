import React from "react";
import Grid from './components/Grid';
import { BrowserRouter,  Route, Switch } from "react-router-dom";
import Transactions from './components/Transactions';

import './App.css';

function App() {
  return (
    <div className="wrapper">
      <h1>Marine Mammals</h1>
      <nav>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/transaction">Transactions</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
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
  );
}

export default App;

// create about component. include h1 tag with text.

const About = () => (
  <div>
    <h1>About</h1>
  </div>
);
