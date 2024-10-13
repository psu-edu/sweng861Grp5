import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the structure of a leaderboard entry
interface LeaderboardEntry {
    name: string;
    score: number;
    teamId: string;
    date: string;
    userId: string;
}

const Leaderboard: React.FC = () => {
    // State to store leaderboard entries
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterTeamId, setFilterTeamId] = useState<string>('');
    const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]); 

    // Fetch leaderboard data from backend using fetch API
    const fetchLeaderboard = async () => {
        setLoading(true); // Set loading state before fetching new data
        try {
            const response = await fetch('http://localhost:8000/leaderboard');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: LeaderboardEntry[] = await response.json();
            setLeaderboard(data);  // Store all entries
            setFilteredLeaderboard(data); // Initialize filtered entries
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch leaderboard');
            setLoading(false);
        }
    };

    // Function to handle filtering by teamId
    const handleFilter = () => {
        if (filterTeamId) {
            const filteredEntries = leaderboard.filter(entry => entry.teamId === filterTeamId);
            setFilteredLeaderboard(filteredEntries);
        } else {
            setFilteredLeaderboard(leaderboard); // Show all if no filter is set
        }
    };

    // Function to handle stopping tracking
    const handleStopTracking = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost/userEntry/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to stop tracking');
            }

            // Remove the entry from the local state
            setLeaderboard(prev => prev.filter(entry => entry.userId !== userId));
            setFilteredLeaderboard(prev => prev.filter(entry => entry.userId !== userId)); // Update filtered entries
        } catch (error) {
            setError('Error stopping tracking');
        }
    };

    // Fetch leaderboard on initial render
    useEffect(() => {
        fetchLeaderboard();
    }, []);

    // Function to format the date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Conditional rendering for loading and error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ margin: '20px' }}>
            <h2>Leaderboard</h2>

            {/* Filter Input */}
            <div style={{ marginBottom: '10px' }}>
                <Input
                    type="text"
                    placeholder="Enter Team ID"
                    value={filterTeamId}
                    onChange={(e) => setFilterTeamId(e.target.value)}
                />
                <Button onClick={handleFilter}>Filter</Button>
            </div>

            {/* Refresh Button */}
            <button onClick={fetchLeaderboard} style={{ marginBottom: '10px' }}>
                Refresh
            </button>

            <table cellPadding="10" cellSpacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Team ID</th>
                        <th>Date</th>
                        <th>Action</th> {/* New column for actions */}
                    </tr>
                </thead>
                <tbody>
                    {filteredLeaderboard.map((entry) => (
                        <tr key={entry.userId}>
                            <td>{entry.name}</td>
                            <td>{entry.score}</td>
                            <td>{entry.teamId}</td>
                            <td>{formatDate(entry.date)}</td>
                            <td>
                                <Button
                                    onClick={() => handleStopTracking(entry.userId)}
                                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    Stop Tracking
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Leaderboard;
