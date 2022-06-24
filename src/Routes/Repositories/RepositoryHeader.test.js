import React from 'react';
import { render, screen } from '@testing-library/react';
import RepositoryHeader from './RepositoryHeader';

describe('RepositoryHeader', () => {
  it('renders correctly', async () => {
    const { container } = render(<RepositoryHeader />);

    expect(screen.getByRole('heading', 'Custom repositories')).toBeDefined();
    expect(
      screen.getByText(
        'Add custom repositories to build RHEL for Edge images with additional packages.'
      )
    ).toBeDefined();
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
