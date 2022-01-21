import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RepositoryHeader from './RepositoryHeader';

describe('RepositoryHeader', () => {
  it('renders correctly', async () => {
    render(<RepositoryHeader />);

    expect(screen.getByRole('heading', 'Applications settings')).toBeDefined();
    expect(screen.getByText('Settings for Fleet Management')).toBeDefined();
    expect(() => screen.getByText('About Fleet Management')).toThrow();
    expect(() =>
      screen.getByText(
        'Fleet Management is a service that allows you to provision, update and maintain edge systems.'
      )
    ).toThrow();
    fireEvent.click(screen.getByTestId('test-pop-over'));
    await waitFor(() =>
      expect(screen.getByText('About Fleet Management')).toBeDefined()
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          'Fleet Management is a service that allows you to provision, update and maintain edge systems.'
        )
      ).toBeDefined()
    );
  });
});
