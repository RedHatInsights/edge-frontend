import React from 'react';
import TableHeader from './TableHeader';
import { render, screen } from '@testing-library/react';

describe('Repository table header', () => {
  it('should render correctly', () => {
    render(<TableHeader />);

    const title = screen.getByTestId('repositories-table-header-title');
    const description = screen.getByTestId(
      'repositories-table-header-description'
    );
    const link = screen.getByTestId('repositories-table-header-link');

    expect(title.innerHTML).toEqual('Custom repositories');
    expect(description.firstChild.textContent).toEqual(
      'Add custom repositories to build RHEL for Edge images with additional packages.'
    );
    expect(link.textContent).toEqual('Learn more');
    expect(link.getAttribute('href')).toEqual('#');
  });
});
