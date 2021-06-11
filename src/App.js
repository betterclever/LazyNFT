import './App.css';
import { AuctionPage } from "./components/auctionpage";
import { SubmitPage } from "./components/submitCollection/submitPage";
import { AllAuctionsPage } from "./components/allAuctionsPage";
import {YourCollectionPage} from './components/yourCollectionPage';
import { TopBar } from "./components/topBar";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div>
        <TopBar />
        <Switch>
          <Route path="/auctions/:collectionId">
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
