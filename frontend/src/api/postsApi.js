import API from './axios';

// add post
export const createPost = async (data) => {
    return await API.post('/post/add', data);
}

// update post
export const editPost = async (data, id) => {
    return await API.put(`/post/update/${id}`, data);
}

// delete post
export const deletePost = async (id) => {
    return await API.delete(`/post/delete/${id}`);
}

// get single post
export const getPost = async (id) => {
    return await API.get(`/post/get/${id}`);
}

// get user created posts
export const myPosts = async () => {
    return await API.get('/post/my-posts/get');
}

// get all posts
export const allPosts = async () => {
    return await API.get('/post/get');
}

// add comment
export const addComment = async (data, id) => {
    return await API.post(`/post/add-comment/${id}`, data);
}

// delete comment
export const deleteComment = async (id) => {
    return API.delete(`/post/delete-comment/${id}`);
}

// get single comment
export const getComment = async (id) => {
    return API.get(`/post/get-comment/${id}`);
}

// get user comments
export const getMyComment = async () => {
    return API.get(`/post/get-my-comments`);
}

// like or unlike a post
export const likeOrUnlikePost = async (id) => {
    return API.put(`/post/like/${id}`);
}

// get likes for a single post
export const getLikes = async (id) => {
    return API.get(`/post/get-likes/${id}`);
}

// get user liked posts
export const getMyLikes = async () => {
    return API.get(`/post/get-my-likes`);
}