import { renderHook, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { useComplaints } from '../hooks/useComplaints';
import { complaintService } from '../services/complaintService';

// Mock the complaint service
vi.mock('../services/complaintService', () => ({
  complaintService: {
    getComplaintsByUser: vi.fn(),
    getAllComplaints: vi.fn(),
    raiseComplaint: vi.fn(),
    closeComplaint: vi.fn(),
    sendComplaintReply: vi.fn(),
  }
}));

describe('useComplaints Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loads user complaints by default', async () => {
    const mockComplaints = [
      { _id: '1', orderId: 'ORD-001', description: 'Test complaint' }
    ];

    complaintService.getComplaintsByUser.mockResolvedValue({
      data: {
        complaints: mockComplaints,
        totalPages: 1,
        currentPage: 1
      }
    });

    const { result } = renderHook(() => useComplaints());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.complaints).toEqual(mockComplaints);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentPage).toBe(1);
  });

  test('loads admin complaints when isAdmin is true', async () => {
    const mockComplaints = [
      { _id: '1', orderId: 'ORD-001', description: 'Test complaint' }
    ];

    complaintService.getAllComplaints.mockResolvedValue({
      data: { complaints: mockComplaints }
    });

    const { result } = renderHook(() => useComplaints(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.complaints).toEqual(mockComplaints);
    expect(complaintService.getAllComplaints).toHaveBeenCalled();
  });

  test('raises complaint successfully', async () => {
    complaintService.raiseComplaint.mockResolvedValue({
      data: { complaint: { _id: '1', orderId: 'ORD-001' } }
    });
    complaintService.getComplaintsByUser.mockResolvedValue({
      data: { complaints: [], totalPages: 1, currentPage: 1 }
    });

    const { result } = renderHook(() => useComplaints());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let raiseResult;
    await act(async () => {
      raiseResult = await result.current.raiseComplaint({
        orderId: 'ORD-001',
        productType: 'Electronics',
        description: 'Test complaint'
      });
    });

    expect(raiseResult.success).toBe(true);
    expect(complaintService.raiseComplaint).toHaveBeenCalledWith({
      orderId: 'ORD-001',
      productType: 'Electronics',
      description: 'Test complaint'
    });
  });

  test('closes complaint successfully', async () => {
    complaintService.closeComplaint.mockResolvedValue({
      data: { message: 'Complaint closed' }
    });
    complaintService.getComplaintsByUser.mockResolvedValue({
      data: { complaints: [], totalPages: 1, currentPage: 1 }
    });

    const { result } = renderHook(() => useComplaints());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.closeComplaint('complaint-id');
    });

    expect(complaintService.closeComplaint).toHaveBeenCalledWith('complaint-id');
  });

  test('sends reply successfully', async () => {
    complaintService.sendComplaintReply.mockResolvedValue({
      data: { reply: { _id: '1', content: 'Test reply' } }
    });
    complaintService.getComplaintsByUser.mockResolvedValue({
      data: { complaints: [], totalPages: 1, currentPage: 1 }
    });

    const { result } = renderHook(() => useComplaints());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.sendReply('complaint-id', 'Test reply');
    });

    expect(complaintService.sendComplaintReply).toHaveBeenCalledWith('complaint-id', 'Test reply');
  });
});
