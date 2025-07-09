import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import { COMMENT_SENTIMENT } from '../../constants/roles';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const CommentManager = () => {
  const [posts, setPosts] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await postService.getPosts();
      const postData = res.data.posts || [];

      const filtered = postData.filter(p => p.comments?.length > 0);
      setPosts(filtered);

      const replyInputs = {};
      filtered.forEach(post => {
        post.comments.forEach(comment => {
          replyInputs[comment._id] = '';
        });
      });
      setReplyTexts(replyInputs);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (commentId, value) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: value }));
  };

  const handleSuggestReply = async (commentId, sentiment, description) => {
    try {
      const res = await postService.getSuggestedReply(sentiment, description);
      setReplyTexts(prev => ({ ...prev, [commentId]: res.data.reply }));
    } catch (err) {
      console.error('Error suggesting reply:', err);
    }
  };

  const handleSendReply = async (commentId) => {
    const reply = replyTexts[commentId];
    if (!reply?.trim()) return;
    
    try {
      await postService.addReply(commentId, reply);
      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
      await loadPosts();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case COMMENT_SENTIMENT.POSITIVE: return 'bg-green-100 text-green-700';
      case COMMENT_SENTIMENT.NEGATIVE: return 'bg-red-100 text-red-700';
      case COMMENT_SENTIMENT.NEUTRAL: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFilteredComments = () => {
    let allComments = [];

    posts.forEach(post => {
      post.comments.forEach(comment => {
        allComments.push({
          ...comment,
          postId: post._id,
          postTitle: post.title
        });
      });
    });

    if (sentimentFilter) {
      allComments = allComments.filter(c => c.sentiment === sentimentFilter);
    }
    if (selectedPostId) {
      allComments = allComments.filter(c => c.postId === selectedPostId);
    }

    return allComments;
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Comment Sentiment Manager</h1>

      <Card className="mb-6">
        <Card.Content className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Filter by Sentiment</label>
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value={COMMENT_SENTIMENT.POSITIVE}>Positive</option>
              <option value={COMMENT_SENTIMENT.NEUTRAL}>Neutral</option>
              <option value={COMMENT_SENTIMENT.NEGATIVE}>Negative</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Filter by Post</label>
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
            >
              <option value="">All Posts</option>
              {posts.map(post => (
                <option key={post._id} value={post._id}>{post.title}</option>
              ))}
            </select>
          </div>
        </Card.Content>
      </Card>

      {getFilteredComments().length === 0 ? (
        <div className="text-center text-gray-500 border rounded p-6 bg-white">
          No comments found matching the filters.
        </div>
      ) : (
        getFilteredComments().map(comment => (
          <Card key={comment._id} className="mb-4">
            <Card.Content>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-semibold">{comment.user?.name || 'Unknown User'}</h2>
                  <p className="text-sm text-gray-500">On: "{comment.postTitle}"</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getSentimentColor(comment.sentiment)}`}>
                  {comment.sentiment}
                </span>
              </div>

              <p className="text-gray-800 italic mb-2">"{comment.content}"</p>
              <p className="text-xs text-gray-400 mb-3">{new Date(comment.createdAt).toLocaleString()}</p>

              <div className="flex gap-2 mb-2">
                <Button
                  onClick={() => handleSuggestReply(comment._id, comment.sentiment, comment.content)}
                  variant="outline"
                  size="sm"
                >
                  💡 Suggest Reply
                </Button>
              </div>

              <div className="flex gap-2">
                <textarea
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Write your reply..."
                  value={replyTexts[comment._id] || ''}
                  onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                />
                <Button
                  onClick={() => handleSendReply(comment._id)}
                  disabled={!replyTexts[comment._id]?.trim()}
                  variant="primary"
                >
                  ➤ Send
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))
      )}
    </div>
  );
};

export default CommentManager;