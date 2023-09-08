import { render, screen } from '@testing-library/react';
import App from './App';

test('Contains summary section', () => {
  render(<App />);
  const linkElement = screen.getByText(/Summary/i);
  expect(linkElement).toBeInTheDocument();
});
