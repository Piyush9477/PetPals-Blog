import API from './axios';

export const allPosts = async () => {
    return await API.get('/post/get');
}