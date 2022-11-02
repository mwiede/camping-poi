import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the filtering box', () => {
  const { getByText } = render(<App />);
  const someElement = getByText(/Black Water Dump/i);
  expect(someElement).toBeInTheDocument();
});
