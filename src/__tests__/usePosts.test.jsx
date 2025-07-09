import { renderHook, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { usePosts } from '../hooks/usePosts';
import { postService } from '../services/postService';

// Mock the post service
vi.mock('../services/postService', () => ({
  postService: {
    getPosts: vi.fn(),
    likePost: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
  }
}));

vi.mock('../services/cookieService', () => {
  return {
    cookieService: {
      getCookie: vi.fn(),
      setCookie: vi.fn(),
      deleteCookie: vi.fn(),
      clearAuthCookies: vi.fn(),
    }
  };
});

describe('usePosts Hook', () => {
  let cookieService;
  beforeEach(() => {
    vi.clearAllMocks();
    cookieService = require('../services/cookieService').cookieService;
    cookieService.getCookie = vi.fn().mockReturnValue(JSON.stringify({ id: 'user-1' }));
  });

  test('loads posts successfully', async () => {
    const mockPosts = [{ _id: '1', title: 'Test Post', likes: 5, likedBy: [] }];
    postService.getPosts.mockResolvedValue({
      data: { posts: mockPosts }
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.posts).toEqual(mockPosts);
  });

  test('handles like functionality', async () => {
    const mockPosts = [{ _id: '1', title: 'Test Post', likes: 5, likedBy: [] }];
    postService.getPosts.mockResolvedValue({
      data: { posts: mockPosts }
    });
    postService.likePost.mockResolvedValue({
      data: { message: 'Post liked' }
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleLike('1');
    });

    expect(postService.likePost).toHaveBeenCalledWith('1');
    expect(result.current.likedPosts.has('1')).toBe(true);
  });

  test('creates post successfully', async () => {
    const mockPost = { _id: '2', title: 'New Post', likes: 0, likedBy: [] };
    postService.getPosts.mockResolvedValue({ data: { posts: [] } });
    postService.createPost.mockResolvedValue({ post: mockPost });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let createResult;
    await act(async () => {
      createResult = await result.current.createPost(new FormData());
    });

    expect(createResult.success).toBe(true);
    expect(result.current.posts).toContainEqual(mockPost);
  });

  test('updates post successfully', async () => {
    const mockPosts = [{ _id: '1', title: 'Original Title', likes: 0, likedBy: [] }];
    const updatedPost = { _id: '1', title: 'Updated Title', likes: 0, likedBy: [] };

    postService.getPosts.mockResolvedValue({ data: { posts: mockPosts } });
    postService.updatePost.mockResolvedValue({ post: updatedPost });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updatePost('1', new FormData());
    });

    expect(updateResult.success).toBe(true);
    expect(result.current.posts[0].title).toBe('Updated Title');
  });

  test('deletes post successfully', async () => {
    const mockPosts = [
      { _id: '1', title: 'Test Post', likes: 0, likedBy: [] },
      { _id: '2', title: 'Another Post', likes: 0, likedBy: [] }
    ];

    postService.getPosts.mockResolvedValue({ data: { posts: mockPosts } });
    postService.deletePost.mockResolvedValue({
      data: { message: 'Post deleted' }
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deletePost('1');
    });

    expect(postService.deletePost).toHaveBeenCalledWith('1');
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0]._id).toBe('2');
  });
});
