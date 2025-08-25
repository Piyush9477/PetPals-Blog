import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { myPosts } from "../api/postsApi";

const MyPosts = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try{
                const response = await myPosts();

                const formattedPosts = response.data.posts.map(post => ({
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    file: post.file,
                    author: {
                        name:post.createdBy.name,
                        avatar: post.createdBy.profilePic
                    },
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                }));

                setPosts(formattedPosts);
            }catch(error){
                console.error('Error fetching posts:', error.message);
            }
        };

        fetchMyPosts();
    }, []);

    const handleEdit = (post) => {
        navigate('/edit-post', {state: {title: post.title, description: post.description, file: post.file, id: post.id}});
    }

    const handelDelete = (id) => {
        navigate('/delete-confirm', {state: {id}});
    }

    return(
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, idx) => (
                    <article key={idx} className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
                        {post.file ? (
                            <img
                                src={post.file}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                                <img src="no-image-logo.png" className="w-41 h-auto" />
                                <span className="text-sm mt-2">No Image Available</span>
                            </div>
                        )}
                        
                        <div className="flex flex-col grow p-6">
                            <div className="mb-3 flex items-center space-x-4 text-gray-500 text-sm">
                                <time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</time>
                            </div>
                            <h3 className="text-gray-900 font-semibold text-lg leading-snug">{post.title}</h3>
                            <p className="mt-2 text-gray-600 text-sm flex-grow max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                                {post.description}
                            </p>
                            <div className="mt-6 flex items-center justify-between">
                                {/* Profile Section */}
                                <div className="flex items-center space-x-4">
                                    {post.author.avatar ? (
                                        <img
                                            className="h-10 w-10 rounded-full object-cover"
                                            src={post.author.avatar}
                                            alt={`${post.author.name} avatar`}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <img
                                            className="h-10 w-10 rounded-full object-cover"
                                            src="no-profile-logo.png"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-900">{post.author.name}</p>  
                                    </div>
                                </div>
                                <div className="space-x-2">
                                    {/* Edit button */}
                                    <button onClick={() => handleEdit(post)} className="button">
                                        Edit
                                    </button>
                                    {/* Delete button */}
                                    <button onClick={() => handelDelete(post.id)} className="button">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default MyPosts;