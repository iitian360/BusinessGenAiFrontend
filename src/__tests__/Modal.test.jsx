import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import Modal from '../components/ui/Modal';

describe('Modal Component', () => {
  test('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <Modal isOpen={true} title="Test Modal" onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('applies different size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} title="Test" size="sm">
        <div>Content</div>
      </Modal>
    );

    let modal = screen.getByText('Content').closest('.max-w-md');
    expect(modal).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} title="Test" size="lg">
        <div>Content</div>
      </Modal>
    );

    modal = screen.getByText('Content').closest('.max-w-4xl');
    expect(modal).toBeInTheDocument();
  });
});
