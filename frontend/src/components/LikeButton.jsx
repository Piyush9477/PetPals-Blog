import { useState, useEffect, useContext } from "react";
import { BiSolidLike  } from "react-icons/bi";
import { likeOrUnlikePost } from "../api/postsApi";
import { AuthContext } from "../contexts/AuthContext";
import { notifyAndRedirect } from "../utils/notifyAndRedirect";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LikeButton = ({postId, isInitiallyLiked}) => {
    const [liked, setLiked] = useState(false);
    const [likingAnimating, setLikingAnimating] = useState(false);

    const {isLoggedIn} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        setLiked(isInitiallyLiked);
    }, [isInitiallyLiked]);

    const handleLike = async () => {
        if(!isLoggedIn){
            toast.error("You must be logged in to like posts!");
            return;
        }

        setLikingAnimating(true);
        setLiked(!liked);

        setTimeout(() => setLikingAnimating(false), 300);
    }

    return(
        <button
            onClick={handleLike}
            className="!bg-transparent !border-none !outline-none !ring-0 transition-transform duration-300 ease-out"
        >
            <BiSolidLike  
                className={`text-2xl transition-colors duration-300 ${
                    liked ? "text-blue-500" : "text-gray-400"
                } ${likingAnimating ? "scale-125" : "scale-100"}`}
            />
        </button>
    );
}

export default LikeButton;