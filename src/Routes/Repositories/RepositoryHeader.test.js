import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RepositoryHeader from './RepositoryHeader';

describe('RepositoryHeader', () => {
  it('renders correctly', async () => {
    const { container } = render(<RepositoryHeader />);

    expect(screen.getByRole('heading', 'Applications settings')).toBeDefined();
    expect(screen.getByText('Settings for Edge Management')).toBeDefined();
    expect(() => screen.getByText('About Edge Management')).toThrow();
    expect(() =>
      screen.getByText(
        'Edge Management is a service that allows you to provision, update and maintain edge systems.'
      )
    ).toThrow();
    fireEvent.click(screen.getByTestId('test-pop-over'));
    await waitFor(() =>
      expect(screen.getByText('About Edge Management')).toBeDefined()
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          'Edge Management is a service that allows you to provision, update and maintain edge systems.'
        )
      ).toBeDefined()
    );

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
