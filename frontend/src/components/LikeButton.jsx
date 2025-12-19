import { useState, useEffect, useContext } from "react";
import { BiSolidLike  } from "react-icons/bi";
import { likeOrUnlikePost } from "../api/postsApi";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const LikeButton = ({postId, isInitiallyLiked, initialLikesCount}) => {
    const [liked, setLiked] = useState(false);
    const [likingAnimating, setLikingAnimating] = useState(false);
    const [count, setCount] = useState(initialLikesCount);

    const {isLoggedIn} = useContext(AuthContext);

    useEffect(() => {
        setLiked(isInitiallyLiked);
        setCount(initialLikesCount);
    }, [isInitiallyLiked, initialLikesCount]);

    const handleLike = async () => {
        if(!isLoggedIn){
            toast.error("You must be logged in to like posts!");
            return;
        }

        setLikingAnimating(true);
        const newLikedStatus = !liked;
        setLiked(newLikedStatus);

        setCount(prev => newLikedStatus ? prev+1 : prev-1);

        setTimeout(() => setLikingAnimating(false), 300);

        try{
            await likeOrUnlikePost(postId);
        }catch(error){
            console.error("Failed to like post:", error);
            setLiked(!newLikedStatus);
            setCount(prev => !newLikedStatus ? prev+1 : prev-1);
            toast.error("Something went wrong. Please try again.");
        }
    }

    return(
        <div className="flex items-center space-x-0.5">
            <button
                onClick={handleLike}
                className="!bg-transparent !border-none !outline-none !ring-0 transition-transform duration-300 ease-out"
            >
                <BiSolidLike
                    className={`text-2xl transition-colors duration-300 ${liked ? "text-blue-500" : "text-gray-400 hover:text-gray-500 transition-colors"
                        } ${likingAnimating ? "scale-125" : "scale-100"}`}
                />
            </button>

            <span className={`text-sm font-medium ${liked ? "text-blue-600" : "text-gray-500"}`}>
                {count}
            </span>
        </div>
    );
}

export default LikeButton;