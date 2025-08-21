import API from './axios';

export const allPosts = async () => {
    return await API.get('/post/get');
}

export const createPost = async (data) => {
    return await API.post('/post/add', data);
}

export const myPosts = async () => {
    return await API.get('/post/my-posts/get');
}