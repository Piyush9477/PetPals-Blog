import { useState } from "react";
import { BiSolidLike  } from "react-icons/bi";
import { likeOrUnlikePost } from "../api/postsApi";
import { useEffect } from "react";

const LikeButton = ({postId, isInitiallyLiked}) => {
    const [liked, setLiked] = useState(false);
    const [likingAnimating, setLikingAnimating] = useState(false);

    useEffect(() => {
        setLiked(isInitiallyLiked);
    }, [isInitiallyLiked]);

    const handleLike = async () => {
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