import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // changed
import Card from '../components/ui/Card';

describe('Card Component', () => {
  test('renders card with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );
    const card = screen.getByText('Content').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  test('renders Card.Header correctly', () => {
    render(
      <Card>
        <Card.Header>Header content</Card.Header>
      </Card>
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  test('renders Card.Content correctly', () => {
    render(
      <Card>
        <Card.Content>Body content</Card.Content>
      </Card>
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  test('renders Card.Footer correctly', () => {
    render(
      <Card>
        <Card.Footer>Footer content</Card.Footer>
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  test('renders complete card structure', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
