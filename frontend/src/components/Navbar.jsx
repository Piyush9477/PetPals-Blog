import { useState, useEffect, useContext } from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {checkAuth} from "../api/authApi";
import { AuthContext } from '../contexts/AuthContext';
import { notifyAndRedirect } from '../utils/notifyAndRedirect';

const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const handleCreatePost = () => {
    if(!isLoggedIn) {
      notifyAndRedirect("You need to log in to continue!", navigate);
      return;
    }
    else{
      navigate("/create-post");
    }
  };

  const handleMyPost = () => {
    if(!isLoggedIn) {
      notifyAndRedirect("You need to log in to view your posts!", navigate);
      return;
    }
    else{
      navigate("/my-posts");
    }
  };

  return (
    <nav >
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img src="logo.png" className="h-12" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap ">PetPals Blog</span>
        </a>

        {/* Navbar Links */}
        <ul className="flex font-medium space-x-10">
          <li>
            <a href="/" className="text-blue-700 dark:text-blue-500 text-xl" aria-current="page">Home</a>
          </li>
          <li>
            <a
              onClick={handleCreatePost}
              className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium cursor-pointer transition-colors text-xl"
            >
              Create Post
            </a>
          </li>
          <li>
            <a
              onClick={handleMyPost}
              className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium cursor-pointer transition-colors text-xl"
            >
              My Posts
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 text-xl">About</a>
          </li>
        </ul>

        { isLoggedIn ? (
          // Profile Dropdown
          <div className="relative">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={userDropdownOpen}
              onClick={toggleUserDropdown}
              aria-haspopup="true"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={user.profilePic || "no-image-logo.png"}
                alt="user photo"
              />
            </button>
            {userDropdownOpen && (
              <div
                className="absolute right-0 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 ">{user.name}</span>
                  <span className="block text-sm text-gray-500 truncate ">{user.email}</span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="/logout-confirm"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <a href="/login" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">Login</a>
        )}

        
      </div>
    </nav>
  );
};

export default Navbar;
