import './App.css';
import {AuctionPage} from "./components/auctionpage";
import {SubmitPage} from "./components/submitCollection/submitPage";
import {useState} from "react";
import {AllAuctionsPage} from "./components/allAuctionsPage";
import {TopBar} from "./components/topBar";

function getPage(index) {
    switch (index) {
        case 0: return <AllAuctionsPage/>
        case 1: return <AllAuctionsPage/>
        case 2: return <AuctionPage/>
        case 3: return <SubmitPage/>
        default: return <div/>
    }
}

function App() {
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <div className="App">
            <TopBar onPageChange={(index) => setCurrentPage(index)}/>
            {getPage(currentPage)}
        </div>
    );
}

export default App;
