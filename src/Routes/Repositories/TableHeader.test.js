import React from 'react';
import { render, screen } from '@testing-library/react';
import TableHeader from './TableHeader';

describe('TableHeader', () => {
  it('renders correctly', () => {
    render(<TableHeader />);

    expect(screen.getByRole('heading', 'Custom repositories')).toBeDefined();
    expect(
      screen.getByText(
        'Add custom repositories to build RHEL for Edge images with additional packages.'
      )
    ).toBeDefined();
  });
});
