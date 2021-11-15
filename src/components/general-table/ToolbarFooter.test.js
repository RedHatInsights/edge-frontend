import React from 'react';
import ToolbarFooter from './ToolbarFooter';
import { render, fireEvent } from '@testing-library/react';

describe('Repository Footer', () => {
  it('should render correctly', async () => {
    const setPage = jest.fn();
    const setPerPage = jest.fn();
    const { findByTestId, findByRole, findByText } = render(
      <ToolbarFooter
        count={100}
        perPage={20}
        setPerPage={setPerPage}
        page={1}
        setPage={setPage}
      />
    );

    const paginationElement = await findByTestId('pagination-footer-test-id');
    const paginationNextPage = await findByRole('button', {
      name: 'Go to next page',
    });
    const paginationPerPage = await findByRole('button', {
      name: 'Items per page',
    });

    expect(paginationElement).toBeDefined();
    expect(paginationElement.children[0].innerHTML).toEqual(
      '<b>1 - 20</b> of <b>100</b> '
    );
    fireEvent.click(paginationNextPage);
    expect(setPage).toHaveBeenCalled();
    fireEvent.click(paginationPerPage);
    fireEvent.click(await findByText('50 per page'));
    expect(setPerPage).toHaveBeenCalled();
  });
});
