import { useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import toast from 'react-hot-toast';

export const useComplaints = (isAdmin = false) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadComplaints();
  }, [isAdmin]);

  const loadComplaints = async (page = 1) => {
    try {
      setLoading(true);
      let response;
      
      if (isAdmin) {
        response = await complaintService.getAllComplaints();
        setComplaints(response.data.complaints || []);
      } else {
        response = await complaintService.getComplaintsByUser(page, 3);
        setComplaints(response.data.complaints || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const raiseComplaint = async (data) => {
    try {
      await complaintService.raiseComplaint(data);
      toast.success('Complaint submitted successfully!');
      if (!isAdmin) loadComplaints();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const closeComplaint = async (id) => {
    try {
      await complaintService.closeComplaint(id);
      toast.success('Complaint closed successfully!');
      loadComplaints(currentPage);
    } catch (error) {
      console.error('Error closing complaint:', error);
    }
  };

  const sendReply = async (id, reply) => {
    try {
      await complaintService.sendComplaintReply(id, reply);
      toast.success('Reply sent successfully!');
      loadComplaints(isAdmin ? 1 : currentPage);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return {
    complaints,
    loading,
    currentPage,
    totalPages,
    loadComplaints,
    raiseComplaint,
    closeComplaint,
    sendReply,
    setCurrentPage
  };
};