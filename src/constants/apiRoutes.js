export const API_BASE_URL = 'https://businessgenaibackend.onrender.com/api';

export const API_ROUTES = {
  // Auth routes
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  
  // Post routes
  POSTS: '/posts',
  CREATE_POST: '/posts/create',
  UPDATE_POST: (id) => `/posts/${id}`,
  DELETE_POST: (id) => `/posts/${id}`,
  LIKE_POST: (id) => `/posts/${id}/like`,
  
  // Comment routes
  CREATE_COMMENT: '/comments/create',
  CREATE_REPLY: '/comment-replies/create',
  
  // Complaint routes
  RAISE_COMPLAINT: '/complaints/raise',
  ALL_COMPLAINTS: '/complaints/all',
  USER_COMPLAINTS: '/complaints/user',
  CLOSE_COMPLAINT: (id) => `/complaints/close/${id}`,
  COMPLAINT_REPLY: '/complaint-replies/create',
  
  // AI routes
  SUGGEST_COMPLAINT_REPLY: '/ai/suggestComplaintReply',
  SUGGEST_COMMENT_REPLY: '/ai/suggestCommentReply'
};