import React from 'react';
import RepositoryHeader from './RepositoryHeader';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Repository Header', () => {
  it('should render correctly', async () => {
    
    render(
      <RepositoryHeader />
    )

    const title = screen.getByTestId('repository-header-title');
    const subTitle = screen.getByTestId('repository-header-sub-title');
    const questionIcon = screen.getByTestId('repository-header-popover-btn');

    expect(title.firstChild.innerHTML).toEqual(' Applications settings ')
    expect(subTitle.firstChild.textContent).toEqual('Settings for Fleet Management')
    expect(questionIcon).toBeDefined()
    fireEvent.click(questionIcon)
    await waitFor(() => {
      expect(screen.getByTestId('repository-header-popover-title').innerHTML).toEqual('About Fleet Management')
      expect(screen.getByTestId('repository-header-popover-body').innerHTML).toEqual('Fleet Management is a service that allows you to provision, update and maintain edge systems.')
      expect(screen.getByTestId('repository-header-popover-footer').firstChild.innerHTML).toEqual('Documentation')
    })
  })
})