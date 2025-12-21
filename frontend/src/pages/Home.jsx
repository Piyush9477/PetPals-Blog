import React, { useEffect, useState, useContext } from "react";
import { allPosts, getMyLikes } from "../api/postsApi";
import LikeButton from "../components/LikeButton";
import CommentButton from "../components/CommentButton";
import { AuthContext } from "../contexts/AuthContext";

const Home = () => {

  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedPostIds, setLikedPostIds] = useState(new Set());

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const postsRes = await allPosts();

        const formattedPosts = postsRes.data.posts.map(post => ({
          id: post.id,
          title: post.title,
          description: post.description,
          file: post.file,
          author: {
            name: post.createdBy.name,
            avatar: post.createdBy.profilePic
          },
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          likesCount: post.likes.count,
          commentsCount: post.comments.count,
          commentsList: post.comments.list,
        }));

        setPosts(formattedPosts);

        if(isLoggedIn){
          const likesRes = await getMyLikes();
          const ids = likesRes.data.likedPosts.map(item => item.id);

          setLikedPostIds(new Set(ids));
        }
        else{
          setLikedPostIds(new Set());
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPageData();
  }, [isLoggedIn]);

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="flex items-center justify-center space-x-4 mb-12">
          <img src="logo.png" alt="Logo" className="w-40 h-auto" />
          <p className="font-serif font-style: italic text-white-600 font-medium text-2xl ">
            Where Every Paw Has a Story!
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, idx) => (
            <article key={idx} className="flex flex-col rounded-lg border border-gray-100 bg-white shadow-sm">

              <div className="mt-0.5 flex items-center space-x-4">
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

              {post.file ? (
                <img
                  src={post.file}
                  alt={post.title}
                  className="w-full h-50 object-cover cursor-pointer hover:opacity-90 transition"
                  loading="lazy"
                  onClick={() => setSelectedImage(post.file)}
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
              </div>

              <div className="mt-1 flex items-center space-x-5">
                <LikeButton
                  postId = {post.id}
                  isInitiallyLiked = {likedPostIds.has(post.id)}
                  initialLikesCount={post.likesCount || 0}
                />
                <CommentButton 
                  postId = {post.id}
                  initialCommentsCount = {post.commentsCount || 0}
                  initialComments = {post.commentsList}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/*Fullscreen image overlay*/}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-gray-300"
          >
            ✖
          </button>
          <img
            src={selectedImage}
            alt="Full view"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
}

export default Home;