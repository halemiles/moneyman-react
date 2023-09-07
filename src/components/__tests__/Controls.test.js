import React from 'react';
import { render, screen } from '@testing-library/react';
import Controls from '../Controls';

test('renders component without errors', () => {
   render(<Controls />);
   const componentElement = screen.getByText(/Refresh/i);
   expect(componentElement).toBeInTheDocument();
});

test('renders component without errors', () => {
   render(<Controls />);
   const componentElement = screen.getByText(/Full/i);
   expect(componentElement).toBeInTheDocument();
});


test('renders component without errors', () => {
  render(<Controls />);
  const componentElement = screen.getByText(/Current/i);
  expect(componentElement).toBeInTheDocument();
});

