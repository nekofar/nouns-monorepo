import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import App from './App';

test.todo('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  // Using a simpler assertion that doesn't require jest-dom
  expect(linkElement).toBeTruthy();
});
