import { useState, useEffect, useContext } from "react";
import {BiSolidComment} from "react-icons/bi";
import { addComment } from "../api/postsApi";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const CommentButton = ({postId, initialCommentsCount, initialComments}) => {
    const [count, setCount] = useState(initialCommentsCount);
    const [showModal, setShowModal] = useState(false);
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");

    const {isLoggedIn} = useContext(AuthContext);

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);
    
    const handleComment = async (e) => {
        e.preventDefault();
        
        if(!isLoggedIn) {
            toast.error("You must be logged in to comment on posts!");
            return;
        }

        if (!newComment.trim()) return;

        try{
            const res = await addComment({ comment: newComment }, postId);

            const newlyAddedComment = {
                comment: newComment,
                createdBy: user.name,
                createdAt: new Date().toLocaleString()
            };

            setComments([...comments, newlyAddedComment]); 
            setCount(prev => prev + 1);
            setNewComment("");
            toast.success("Comment added!");
        }
        catch(error) {
            toast.error("Failed to add comment");
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