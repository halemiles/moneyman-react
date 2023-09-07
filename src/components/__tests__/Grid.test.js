import React from 'react';
import { render, screen } from '@testing-library/react';
import Grid from '../Grid';



 test('Grid should contain Transaction as a column', () => {
    render(<Grid />);
    const linkElement = screen.getByText(/Transaction/i);
    expect(linkElement).toBeInTheDocument();    
 });

// test('Grid should contain Amount as a column', () => {
//     render(<Grid />);
//     const linkElement = screen.getByText(/Amount/i);
//     expect(linkElement).toBeInTheDocument();
// });

// test('Grid should contain Date as a column', () => {
//     render(<Grid />);
//     const linkElement = screen.getByText(/Date/i);
//     expect(linkElement).toBeInTheDocument();
// });


