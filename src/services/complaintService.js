import api from './api';
import { API_ROUTES } from '../constants/apiRoutes';

export const complaintService = {
  raiseComplaint: async (data) => api.post(API_ROUTES.RAISE_COMPLAINT, data),

  getAllComplaints: async () => api.get(API_ROUTES.ALL_COMPLAINTS),

  getComplaintsByUser: (page = 1, limit = 3) => {
    return api.get(`${API_ROUTES.USER_COMPLAINTS}?page=${page}&limit=${limit}`);
  },

  closeComplaint: async (id) => api.patch(API_ROUTES.CLOSE_COMPLAINT(id)),

  sendComplaintReply: async (id, reply) => {
    return api.post(API_ROUTES.COMPLAINT_REPLY, { complaintId: id, content: reply });
  },

  getSuggestedReply: async (severity, description) => {
    return api.post(API_ROUTES.SUGGEST_COMPLAINT_REPLY, { severity, description });
  }
};