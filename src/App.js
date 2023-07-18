import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import store from './redux/store';
import { Provider } from 'react-redux';

// pages
import Home from './pages/Home';

// components
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="relative sm:p-8 p-4 bg-[#1C1D30] min-h-screen flex flex-row">
      <Router>
      <div className="flex mr-10 relative">
        <Sidebar />
      </div>
        <Provider store={store}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Provider>
        </Router>
    </div>
  );
}

export default App;
