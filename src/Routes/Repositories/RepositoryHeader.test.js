import React from 'react';
import RepositoryHeader from './RepositoryHeader';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Repository Header', () => {
  it('should render correctly', () => {
    
    render(
      <RepositoryHeader />
    )

    const title = screen.getByTestId('repository-header-title');
    const subTitle = screen.getByTestId('repository-header-sub-title');
    const questionIcon = screen.getByTestId('repository-header-question-icon');

    expect(title.firstChild.innerHTML).toEqual(' Applications settings ')
    expect(subTitle.firstChild.textContent).toEqual('Settings for Fleet Management')
    expect(questionIcon).toBeDefined()
    fireEvent.click(questionIcon)
    expect(screen.getByTestId('repository-header-popover')).toBeDefined()
  })
})