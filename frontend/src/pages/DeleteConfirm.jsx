import { useNavigate, useLocation } from "react-router-dom";
import { deletePost } from "../api/postsApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {id} = location.state || {};

    const handleCancel = () => {
        navigate(-1); 
    };

    const handleDelete = async () => {
        try{
            await deletePost(id);
            toast.success("Post deleted successfully");
            setTimeout(() => {
                navigate("/my-posts");
            }, 1500);
        }catch(error){
            toast.error("Failed to delete post! Please try again");
            console.error("Failed to delete post:", error.response?.data || error.message);
        }
            
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
            <ToastContainer />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleDelete();
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
                    Are you sure you want to delete this post?
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
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeleteConfirm;
