import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useComplaints } from '../../hooks/useComplaints';
import { COMPLAINT_STATUS } from '../../constants/roles';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const MyComplaints = () => {
  const { complaints, loading, currentPage, totalPages, closeComplaint, sendReply, loadComplaints, setCurrentPage } = useComplaints();
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

  const handleToggleExpand = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const handleReplyChange = (id, value) => {
    setReplyTexts({ ...replyTexts, [id]: value });
  };

  const handleSendReply = async (id) => {
    const reply = replyTexts[id];
    if (!reply?.trim()) return;
    
    await sendReply(id, reply);
    setReplyTexts({ ...replyTexts, [id]: '' });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    loadComplaints(pageNumber);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case COMPLAINT_STATUS.RESOLVED: return 'bg-green-100 text-green-700 border-green-300';
      case COMPLAINT_STATUS.IN_PROGRESS: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case COMPLAINT_STATUS.OPEN: return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">My Complaints</h2>

      {complaints.length === 0 ? (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md border border-blue-300">
          No complaints found. You can raise a new complaint from the dashboard.
        </div>
      ) : (
        complaints.map((complaint) => (
          <Card key={complaint._id} className="mb-4">
            <Card.Content>
              <div className="flex cursor-pointer justify-between items-start mb-3">
                <h3
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => handleToggleExpand(complaint._id)}
                >
                  Order #{complaint.orderId}
                </h3>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-sm rounded border capitalize ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                  {complaint.status !== COMPLAINT_STATUS.RESOLVED && (
                    <Button
                      onClick={() => closeComplaint(complaint._id)}
                      variant="outline"
                      size="sm"
                    >
                      Close issue
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Product: {complaint.productType}
              </p>
              <p className="text-base mb-3">{complaint.description}</p>
              <p className="text-xs text-gray-500">
                Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
              </p>

              {expandedComplaint === complaint._id && (
                <>
                  {complaint.replies?.length > 0 && (
                    <div className="bg-gray-100 p-3 rounded mt-4 mb-2">
                      <p className="font-medium text-sm mb-2">Replies:</p>
                      {complaint.replies.map((reply, index) => (
                        <p key={index} className="text-sm mb-1">
                          <strong>{reply.userId?.name || 'User'}:</strong> {reply.content}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-3 mt-3">
                    <textarea
                      rows={2}
                      className="w-full border rounded outline-none p-1 text-sm"
                      placeholder="Write a reply..."
                      value={replyTexts[complaint._id] || ''}
                      onChange={(e) => handleReplyChange(complaint._id, e.target.value)}
                    />
                    <Button
                      onClick={() => handleSendReply(complaint._id)}
                      disabled={!replyTexts[complaint._id]?.trim()}
                      variant="success"
                    >
                      <FaPaperPlane />
                    </Button>
                  </div>
                </>
              )}
            </Card.Content>
          </Card>
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            variant={currentPage === i + 1 ? 'primary' : 'outline'}
            size="sm"
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MyComplaints;