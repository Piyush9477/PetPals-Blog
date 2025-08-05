import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyUser from "./pages/VerifyUser";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify-user" element={<VerifyUser/>} />
      </Routes>
    </>
  );
};

export default App;
