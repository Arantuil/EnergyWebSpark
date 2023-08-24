import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import store from './redux/store';
import { Provider } from 'react-redux';
import { useState, useEffect } from 'react';

// pages
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import EditCampaign from './pages/EditCampaign';
import CampaignDetails from './pages/CampaignDetails';
import Profile from './pages/Profile';

import Offline from './pages/Offline';

// components
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

function App() {
  const [isOffline, setIsOffline] = useState(false);

  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const openTimestamp = 1693054800

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    isOffline === false && currentTimestamp > openTimestamp ? (
    <div className="xs:p-2 p-3 sm:p-6 md:p-8 relative bg-[#1C1D30] min-h-screen flex flex-row">
      <Provider store={store}>
        <Router>
          <Sidebar />
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/edit-campaign/:id" element={<EditCampaign />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route exact path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </Provider>
    </div>
    ) : (
      <div className="xs:px-2 px-3 sm:px-6 md:px-8 relative justify-center bg-[#1C1D30] min-h-[100%] flex flex-row">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Offline difference={openTimestamp-currentTimestamp} />} />
          </Routes>
        </Router>
      </Provider>
    </div>
    )
  );
}

export default App;
