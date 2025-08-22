import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyUser from "./pages/VerifyUser";
import Navbar from "./components/Navbar";
import LogoutConfirm from "./pages/LogoutConfirm";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/verify-user" element={<VerifyUser/>} />
          <Route path="/logout-confirm" element={<LogoutConfirm/>} />
          <Route path="/create-post" element={<CreatePost/>} />
          <Route path="/my-posts" element={<MyPosts/>} />
          <Route path="/edit-post" element={<EditPost/>} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
