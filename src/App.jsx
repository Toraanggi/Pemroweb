import { Routes, Route } from "react-router-dom";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/layout/PrivateRoute";
import Blank from "./pages/Blank";
import Community from "./pages/Community";
import Subscription from "./pages/Subscription";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route
          exact
          path="/dashboard"
          element={<PrivateRoute component={<Dashboard />} />}
        />
        <Route
          exact
          path="/community"
          element={<PrivateRoute component={<Community />} />}
        />
        <Route
          exact
          path="/subscription"
          element={<PrivateRoute component={<Subscription />} />}
        />
        <Route
          exact
          path="/profile"
          element={<PrivateRoute component={<Profile />} />}
        />
      </Routes>
    </div>
  );
}

export default App;