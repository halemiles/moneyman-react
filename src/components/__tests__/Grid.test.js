import React from 'react';
import { render, screen } from '@testing-library/react';
import Grid from '../Grid';



 test('Grid should contain Transaction as a column', () => {
    render(<Grid />);
    const linkElement = screen.getByText("Transaction Name");
    expect(linkElement).toBeInTheDocument();    
 });

test('Grid should contain Amount as a column', () => {
    render(<Grid />);
    const linkElement = screen.getByText("Amount");
    expect(linkElement).toBeInTheDocument();
});

test('Grid should contain Date as a column', () => {
    render(<Grid />);
    const linkElement = screen.getByText("Date");
    expect(linkElement).toBeInTheDocument();
});


