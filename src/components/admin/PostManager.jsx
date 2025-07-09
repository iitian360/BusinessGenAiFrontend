import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaPaperPlane, FaTrash, FaEdit } from 'react-icons/fa';
import { usePosts } from '../../hooks/usePosts';
import { postService } from '../../services/postService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const PostManager = () => {
  const { posts, setPosts, loading, likedPosts, handleLike, createPost, updatePost, deletePost, loadPosts } = usePosts();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image: '' });
  const [comments, setComments] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [openComments, setOpenComments] = useState({});

  React.useEffect(() => {
    const commentsObj = {};
    posts.forEach(post => {
      commentsObj[post._id] = '';
    });
    setComments(commentsObj);
  }, [posts]);

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({ title: '', description: '', image: '' });
    setOpenDialog(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      image: post.image?.url || ''
    });
    setOpenDialog(true);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await deletePost(postId);
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    if (formData.image instanceof File) {
      form.append('image', formData.image);
    }

    let result;
    if (editingPost) {
      result = await updatePost(editingPost._id, form);
    } else {
      result = await createPost(form);
    }

    if (result.success) {
      setOpenDialog(false);
      setFormData({ title: '', description: '', image: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // Comment and reply handlers (similar to ViewPosts)
  const toggleComments = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleCommentChange = (postId, value) => {
    setComments({ ...comments, [postId]: value });
  };

  const handleCommentSubmit = async (postId) => {
    const content = comments[postId];
    if (!content?.trim()) return;
    
    try {
      const response = await postService.addComment(postId, content);
      const newComment = response.data.comment || response.data;
      
      // Update posts state locally instead of reloading all posts
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                comments: [...(post.comments || []), {
                  ...newComment,
                  user: newComment.user || { name: 'You' } // Fallback for current user
                }] 
              }
            : post
        )
      );
      
      setComments({ ...comments, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReplyInputChange = (commentId, value) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: value }));
  };

  const handleReplySubmit = async (commentId) => {
    const content = replyInputs[commentId];
    if (!content?.trim()) return;
    
    try {
      const response = await postService.addReply(commentId, content);
      const newReply = response.data.reply || response.data;
      
      // Update posts state locally instead of reloading all posts
      setPosts(prevPosts => 
        prevPosts.map(post => ({
          ...post,
          comments: post.comments?.map(comment => 
            comment._id === commentId
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), {
                    ...newReply,
                    user: newReply.user || { name: 'You' } // Fallback for current user
                  }] 
                }
              : comment
          ) || []
        }))
      );
      
      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Post Management</h1>
        <Button onClick={handleCreatePost} variant="primary">
          + Create Post
        </Button>
      </div>

      {posts.map((post) => (
        <Card key={post._id} className="mb-6 postBox">
          {post.image?.url && (
            <img src={post.image.url} alt={post.title} className="w-full h-72 object-contain bg-gray-100 rounded" />
          )}

          <Card.Content>
            <div className="flex justify-between mb-2">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeletePost(post._id)}>
                  <FaTrash />
                </Button>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{post.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={() => handleLike(post._id)}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${likedPosts.has(post._id) ? 'text-red-500' : 'text-black'}`}
              >
                {likedPosts.has(post._id) ? <FaHeart /> : <FaRegHeart />} {post.likes} Likes
              </Button>
              <Button
                onClick={() => toggleComments(post._id)}
                variant="outline"
                size="sm"
              >
                {post.comments?.length || 0} Comments
              </Button>
            </div>

            <hr className="my-4" />

            {openComments[post._id] && (
              <div className="mt-4">
                {post.comments?.map((comment) => (
                  <div key={comment._id} className="mb-4 p-3 bg-gray-100 rounded-md">
                    <p className="text-blue-600 font-medium">{comment.user?.name || 'Unknown User'}</p>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>

                    <Button
                      onClick={() => toggleReplies(comment._id)}
                      variant="outline"
                      size="sm"
                      className="mt-1"
                    >
                      {showReplies[comment._id] ? 'Hide Replies' : 'View Replies'}
                    </Button>

                    {showReplies[comment._id] && (
                      <div className="ml-4 mt-2">
                        {comment.replies?.map(reply => (
                          <div key={reply._id} className="mb-2 bg-white p-2 rounded shadow-sm border">
                            <p className="text-green-600 font-medium">{reply.user?.name || 'User'}</p>
                            <p className="text-sm">{reply.content}</p>
                            <p className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString()}</p>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyInputs[comment._id] || ''}
                            onChange={(e) => handleReplyInputChange(comment._id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleReplySubmit(comment._id);
                              }
                            }}
                            className="flex-grow px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <Button
                            onClick={() => handleReplySubmit(comment._id)}
                            size="sm"
                            variant="primary"
                          >
                            <FaPaperPlane />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={comments[post._id] || ''}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentSubmit(post._id);
                      }
                    }}
                    className="flex-grow px-3 py-2 border border-red-400 rounded-md text-sm"
                  />
                  <Button
                    onClick={() => handleCommentSubmit(post._id)}
                    disabled={!comments[post._id]?.trim()}
                    variant="primary"
                  >
                    <FaPaperPlane />
                  </Button>
                </div>
              </div>
            )}
          </Card.Content>
        </Card>
      ))}

      <Modal
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        title={editingPost ? 'Edit Post' : 'Create New Post'}
      >
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <label className="block w-full cursor-pointer">
            <span className="block text-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100">Upload Image</span>
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </label>
          {formData.image && (
            <img
              src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.description}
              variant="primary"
            >
              {editingPost ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostManager;