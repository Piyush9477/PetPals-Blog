import { useState, useEffect, useContext } from "react";
import {BiSolidComment} from "react-icons/bi";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const CommentButton = ({initialCommentsCount}) => {
    const [count, setCount] = useState(initialCommentsCount);

    const {isLoggedIn} = useContext(AuthContext);

    const handleComment = async () => {
        if(!isLoggedIn) {
            toast.error("You must be logged in to comment on posts!");
            return;
        }
    }

    return(
        <div className="flex items-center space-x-0.5">
            <button
                onClick={handleComment}
                className="flex items-center justify-center !bg-transparent border-none !outline-none p-0"
            >
                <BiSolidComment className="text-2xl text-gray-400 hover:text-gray-500 transition-colors"/>
            </button>
            <span className={"text-sm font-medium text-gray-500"}>
                {count}
            </span>
        </div>
    );
}

export default CommentButton;