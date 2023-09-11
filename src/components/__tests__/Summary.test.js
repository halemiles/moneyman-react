import React from 'react';
import { render, screen } from '@testing-library/react';
import Summary from '../Summary';

// mock props. plandates should contains data
const props = {
    planDates: [
        {
            transactionName: "transaction 1",
            amount: 10,
            date: "2021-01-01"
        },
        {
            transactionName: "trandaction 2",
            amount: 90,
            date: "2021-01-01"
        }
    ]
};

test('Summary should contain actual', () => {
    render(<Summary {...props} />);
    const linkElement = screen.getByText(/Actual/i);
    expect(linkElement).toBeInTheDocument();
});

// input with id actualValue should contain 2200
test('Actual input should contain 2200', () => {
    render(<Summary {...props} />);
    const linkElement = screen.getByDisplayValue("2200");
    expect(linkElement).toBeInTheDocument();
}
);

test('Due should contain 100', () => {
    render(<Summary {...props} />);
    const linkElement = screen.getByText("Due: 100.00");
    expect(linkElement).toBeInTheDocument();
}
);

// snapshot test
test('Summary should match snapshot', () => {
    const { container } = render(<Summary {...props} />);
    expect(container).toMatchSnapshot();
});


//  test('Summary should contain actual', () => {
//     render(<Summary />);
//     const linkElement = screen.getByText(/Actual/i);
//     expect(linkElement).toBeInTheDocument();    
//  });

//  test('Summary should contain due', () => {
//     render(<Summary />);
//     const linkElement = screen.getByText(/Due/i);
//     expect(linkElement).toBeInTheDocument();    
//  });

//  test('Summary should contain remaining', () => {
//     render(<Summary />);
//     const linkElement = screen.getByText(/Remaining/i);
//     expect(linkElement).toBeInTheDocument();    
//  });