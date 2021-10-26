import React from 'react';
import Empty from './Empty';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Empty repo state', () => {
  it('should render correctly', () => {
    const primaryActionMockClick = jest.fn();

    const secondaryActionsObj = [
      {
        title: 'first empty state secondary action',
        link: 'testlinkone.test',
      },
      {
        title: 'second empty state secondary action',
        link: 'testlinktwo.test',
      },
    ];

    render(
      <Empty
        icon="repository"
        title="empty state title"
        body="empty state body"
        primaryAction={{
          text: 'empty state primary action',
          click: primaryActionMockClick,
        }}
        secondaryActions={secondaryActionsObj}
      />
    );

    const icon = screen.getByTestId('empty-state-icon');
    const title = screen.getByTestId('empty-state-title');
    const body = screen.getByTestId('empty-state-body');
    const primaryAction = screen.getByTestId('empty-state-primary-action');
    const secondaryActions = screen.getByTestId(
      'empty-state-secondary-actions'
    );
    const secondaryActionsArray = [...secondaryActions.children];

    expect(icon.tagName).toEqual('svg');
    expect(title.innerHTML).toEqual('empty state title');
    expect(body.innerHTML).toEqual('empty state body');
    expect(primaryAction.innerHTML).toEqual('empty state primary action');
    fireEvent.click(primaryAction);
    expect(primaryActionMockClick).toHaveBeenCalled();
    secondaryActionsArray.forEach((action, index) => {
      expect(action.firstChild.innerHTML).toEqual(
        secondaryActionsObj[index].title
      );
      expect(action.firstChild.getAttribute('href')).toEqual(
        secondaryActionsObj[index].link
      );
    });
  });
});
