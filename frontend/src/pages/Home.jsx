import React, { useEffect, useState } from "react";
import {allPosts} from "../api/postsApi"

const Home = () => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
      const fetchallPosts = async () => {
        try{
          const response = await allPosts();

          const formattedPosts = response.data.posts.map(post => ({
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

      fetchallPosts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
      <div className="flex items-center justify-center space-x-4 mb-12">
        <img src="logo.png" alt="Logo" className="w-40 h-auto" />
        <p className="font-serif font-style: italic text-white-600 font-medium text-2xl ">
          Where Every Paw Has a Story!
        </p>
      </div>

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

              <div className="mt-6 flex items-center space-x-4">
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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Home;