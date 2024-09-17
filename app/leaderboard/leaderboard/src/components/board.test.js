import { render, screen, fireEvent } from "@testing-library/react"
import Board from "./board";

// Mock data for users
const users = [
    { id: 1, name: 'Race', score: 100, date: '2024-09-14' },
    { id: 2, name: 'Chad', score: 200, date: '2024-09-10' },
    { id: 3, name: 'Ben', score: 150, date: '2024-08-25' }, // 20 days ago
    { id: 4, name: 'Josh', score: 250, date: '2024-07-15' }, // Older than 30 days
];


test('on inital render, All-Time filter button is enable', async () => {
    render(<Board/>);
    expect(await screen.findByRole('button', { name: /all-time/i })).toBeEnabled();
});

test('on inital render, 7 Days filter button is enable', async () => {
    render(<Board />);
    expect(await screen.findByRole('button', { name: /7 days/i })).toBeEnabled();
});

test('on inital render, 30 Days filter button is enable', async () => {
    render(<Board />);
    expect(await screen.findByRole('button', { name: /30 days/i })).toBeEnabled();
});

test('if the All-Time filter is clicked, the user with the highest score is displayed', () => {
    render(<Board users={users} />);
    
    // Select "All Time" filter
    const button = screen.getByRole('button', { name: /all-time/i });
    fireEvent.click(button);

    // Expect Josh (who has 250 points) to be at the top
    const firstUser = screen.getByText('Josh');
    expect(firstUser).toBeInTheDocument();
});

test('if the 7 Days filter is clicked, the user with the highest score is within 7 days displayed', () => {
    render(<Board users={users} />);

    // Select "7 Days" filter
    const button = screen.getByRole('button', { name: /7 days/i });
    fireEvent.click(button);

    // Expect Chad (who has 200 points within the last 7 days) to be at the top
    const firstUser = screen.getByText('Chad');
    expect(firstUser).toBeInTheDocument();
});

test('if the 30 Days filter is clicked, the user with the highest score is within 30 days displayed', () => {
    render(<Board users={users} />);

    // Select "7 Days" filter
    const button = screen.getByRole('button', { name: /30 days/i });
    fireEvent.click(button);

    // Expect Ben (who has 159 points within the last 30 days) to be at the top
    const firstUser = screen.getByText('Ben');
    expect(firstUser).toBeInTheDocument();
});