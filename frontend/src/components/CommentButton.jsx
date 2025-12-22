import { useState, useEffect, useContext } from "react";
import {BiSolidComment, BiX} from "react-icons/bi";
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

        if (!newComment) return;

        try{
            const res = await addComment({ content: newComment }, postId);

            const newlyAddedComment = {
                comment: newComment
            };

            setComments([...comments, newlyAddedComment]); 
            setCount(prev => prev + 1);
            setNewComment("");
            toast.success("Comment added!");
        }
        catch(error) {
            console.log(error);
            toast.error("Failed to add comment");
        }
    }

    return(
        <div className="flex items-center space-x-0.5">
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center !bg-transparent border-none !outline-none p-0"
            >
                <BiSolidComment className="text-2xl text-gray-400 hover:text-gray-500 transition-colors"/>
            </button>

            <span className={"text-sm font-medium text-gray-500"}>
                {count}
            </span>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md flex flex-col h-[500px] shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Comments ({count})</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-2xl text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <BiX />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {comments && comments.length > 0 ? (
                                comments.map((c, index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-blue-600">
                                                {c.createdBy}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {c.createdAt}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{c.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 mt-10">
                                    <p>No comments yet.</p>
                                    <p className="text-xs">Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t bg-white rounded-b-lg">
                            {isLoggedIn ? (
                                <form onSubmit={handleComment} className="flex flex-col space-y-2">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                        rows="2"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment}
                                        className="bg-blue-500 disabled:bg-gray-300 text-white text-sm py-2 rounded-md font-semibold hover:bg-blue-600 transition"
                                    >
                                        Post Comment
                                    </button>
                                </form>
                            ) : (
                                <p className="text-sm text-center text-gray-500 py-2">
                                    Please login to participate in the discussion.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommentButton;