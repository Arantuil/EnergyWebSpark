import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import store from './redux/store';
import { Provider } from 'react-redux';

// pages
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';

// components
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="relative sm:p-6 p-3 bg-[#1C1D30] min-h-screen flex flex-row">
      <Provider store={store}>
        <Router>
        <div className="flex mr-3 sm:mr-6 relative">
          <Sidebar />
        </div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
