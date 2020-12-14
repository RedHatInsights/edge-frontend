import React from 'react';
import Groups from './Groups';

import { render } from '@testing-library/react';

describe('Groups', () => {
  it('should render correctly', () => {
    const { container } = render(<Groups />);
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
