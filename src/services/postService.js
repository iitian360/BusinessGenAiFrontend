import api from './api';
import { API_ROUTES } from '../constants/apiRoutes';

export const postService = {
  getPosts: () => api.get(API_ROUTES.POSTS),

  createPost: async (formData) => {
    const response = await api.post(API_ROUTES.CREATE_POST, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updatePost: async (postId, formData) => {
    const response = await api.put(API_ROUTES.UPDATE_POST(postId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(API_ROUTES.DELETE_POST(postId));
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.put(API_ROUTES.LIKE_POST(postId));
    return response.data;
  },

  addComment: async (postId, content) => {
    const response = await api.post(API_ROUTES.CREATE_COMMENT, { content, postId });
    return response;
  },

  addReply: async (commentId, content) => {
    const response = await api.post(API_ROUTES.CREATE_REPLY, { commentId, content });
    return response;
  },

  getSuggestedReply: async (sentiment, description) => {
    return await api.post(API_ROUTES.SUGGEST_COMMENT_REPLY, { sentiment, description });
  }
};