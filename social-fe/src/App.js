import Home from "./pages/homePage/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profilePage/Profile";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Register />} />
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={!user ? <Navigate replace to="/" /> : <Register />}
        />
        <Route
          path="/messenger"
          element={!user ? <Navigate replace to="/" /> : <Messenger />}
        />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
