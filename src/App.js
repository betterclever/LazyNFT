import './App.css';
import { AuctionPage } from "./components/auctionpage";
import { SubmitPage } from "./components/submitPage";
import { useState } from "react";
import { AllAuctionsPage } from "./components/allAuctionsPage";
import {YourCollectionPage} from './components/yourCollectionPage';
import { TopBar } from "./components/topBar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div>
        <TopBar />
        {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/claim/:collectionId">
            <AuctionPage />
          </Route>
          <Route path="/mintYourOwn">
            <SubmitPage />
          </Route>
          <Route path="/yourCollection">
            <YourCollectionPage/>
          </Route>
          <Route path="/">
            <AllAuctionsPage />
          </Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
