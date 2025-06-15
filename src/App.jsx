import { Routes, Route } from "react-router-dom";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/layout/PrivateRoute";
import Blank from "./pages/Blank";
import Others from "./pages/Others/others";
import Educations from "./pages/Educations/educations";


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
          path="/educations"
          element={<PrivateRoute component={<Educations />} />}
        />
        <Route
          exact
          path="/music"
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path="/movie"
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path="/song"
          element={<PrivateRoute component={<Blank />} />}
        />                
        <Route
          exact
          path="/profile"
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path="/others"
          element={<PrivateRoute component={<Others />} />}
        />
      </Routes>
    </div>
  );
}

export default App;