import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const LogoutConfirm = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); 
  };

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#fffdf285", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogout();
        }}
        style={{
          backgroundColor: "#1a1a1a", 
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid transparent",
          color: "rgba(255,255,255,0.87)", 
          fontFamily:
            "system-ui, Avenir, Helvetica, Arial, sans-serif",
          textAlign: "center",
          minWidth: "320px",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
          Are you sure you want to log out?
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid transparent",
              padding: "0.6em 1.2em",
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.25s",
              color: "rgba(255,255,255,0.87)",
              borderRadius: "8px",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#00ffff")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid transparent",
              padding: "0.6em 1.2em",
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.25s",
              color: "#ff4c4c",
              borderRadius: "8px",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ff4c4c")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogoutConfirm;
