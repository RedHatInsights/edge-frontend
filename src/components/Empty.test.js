import React from 'react';
import { render, screen } from '@testing-library/react';
import Empty from './Empty';

describe('Empty', () => {
  it('renders correctly', () => {
    const primaryAction = {
      text: 'Primary action',
      click: () => jest.fn(),
    };

    const secondaryActions = [
      {
        title: 'Secondary action',
        type: 'link',
        link: '#',
      },
    ];

    const { container } = render(
      <Empty
        icon="repository"
        title="Test empty state title"
        body="Test empty state body"
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
      />
    );

    expect(screen.getByRole('heading', 'Test empty state title')).toBeDefined();
    expect(screen.getByRole('button', 'Primary action')).toBeDefined();
    expect(screen.getByRole('link', 'Secondary action')).toBeDefined();
    expect(screen.getByText('Test empty state body')).toBeDefined();

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
