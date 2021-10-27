import React from 'react';
import RepositoryTable from './RepositoryTable';
import { render, screen } from '@testing-library/react';

describe('Repository table', () => {
  it('should render correctly', async () => {

    const toolbarBntFunc = jest.fn()

    const toggleFunc = jest.fn()

    render(
      <RepositoryTable
        data={[
          {
            id: 0,
            name: 'test',
            baseURL: 'test.url'
          },
          {
            id: 1,
            name: 'test2',
            baseURL: 'test2.url'
          }
        ]}
        toolbarButtons={[
          {
            title: 'test toolbar button',
            click: toolbarBntFunc,
          },
        ]}
        toggle={toggleFunc}
      />
    );

    const toolbarBtn = screen.getByText('test toolbar button')
    const row1 = screen.getByText('test')
    const row2 = screen.getByText('test2.url')

    expect(toolbarBtn).toBeDefined()
    expect(row1).toBeDefined()
    expect(row2).toBeDefined()

  });
});
