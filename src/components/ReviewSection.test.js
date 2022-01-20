import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewSection from './ReviewSection';

describe('ReviewSection', () => {
  it('renders correctly', () => {
    const data = [
      {
        name: 'test name 1',
        value: 'test value 1',
      },
      {
        name: 'test name 2',
        value: 'test value 2',
      },
      {
        name: 'test name 3',
        value: 'test value 3',
      },
    ];

    render(<ReviewSection title="Test title" data={data} testid="testId-1" />);

    expect(screen.getByRole('heading', 'Test title')).toBeDefined();
    expect(screen.getAllByText(/test name/i)).toHaveLength(3);
  });
});
