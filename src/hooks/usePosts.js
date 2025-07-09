import { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import { cookieService } from '../services/cookieService';
import toast from 'react-hot-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts();
      const fetchedPosts = response.data.posts;
      setPosts(fetchedPosts);

      // Set liked posts
      const userCookie = cookieService.getCookie('user');
      const user = userCookie ? JSON.parse(userCookie) : null;
      const likedSet = new Set();
      fetchedPosts.forEach(post => {
        if (user && post.likedBy.includes(user.id)) {
          likedSet.add(post._id);
        }
      });
      setLikedPosts(likedSet);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      const newLikedPosts = new Set(likedPosts);
      
      if (likedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      
      setLikedPosts(newLikedPosts);
      setPosts(posts.map(post => post._id === postId ? {
        ...post,
        likes: newLikedPosts.has(postId) ? post.likes + 1 : post.likes - 1
      } : post));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const createPost = async (formData) => {
    try {
      const response = await postService.createPost(formData);
      setPosts([response.post, ...posts]);
      toast.success('Post created successfully!');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePost = async (postId, formData) => {
    try {
      const response = await postService.updatePost(postId, formData);
      setPosts(posts.map(post => post._id === postId ? response.post : post));
      toast.success('Post updated successfully!');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(p => p._id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return {
    posts,
    setPosts,
    loading,
    likedPosts,
    loadPosts,
    handleLike,
    createPost,
    updatePost,
    deletePost
  };
};