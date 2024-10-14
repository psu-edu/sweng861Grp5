import { InternalMenu } from "@/components/internal-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type LoaderFunction, redirect } from "@remix-run/node";
import type React from "react";
import { useEffect, useState } from "react";

// Define the structure of a leaderboard entry, now with a userId
interface LeaderboardEntry {
  name: string;
  score: number;
  teamId: string; // teamId for filtering
  date: string;
  userId: string;
}

const Leaderboards: React.FC = () => {
  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTeamId, setFilterTeamId] = useState<string>(""); // State for the filter input
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]); // State for filtered entries

  // Goal creation states
  const [metric, setMetric] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [interval, setInterval] = useState<string>("");
  const [errors, setErrors] = useState({ metric: "", goal: "", interval: "" });

  // Fetch leaderboard data from backend using fetch API
  const fetchLeaderboard = async () => {
    setLoading(true); // Set loading state before fetching new data
    try {
      const response = await fetch("http://localhost:8000/leaderboard");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: LeaderboardEntry[] = await response.json();
      setLeaderboard(data); // Store all entries
      setFilteredLeaderboard(data); // Initialize filtered entries
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch leaderboard");
      setLoading(false);
    }
  };

  // Function to handle filtering by teamId
  const handleFilter = () => {
    if (filterTeamId) {
      const filteredEntries = leaderboard.filter((entry) => entry.teamId === filterTeamId);
      setFilteredLeaderboard(filteredEntries);
    } else {
      setFilteredLeaderboard(leaderboard); // Show all if no filter is set
    }
  };

  // Function to handle stopping tracking
  const handleStopTracking = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost/userEntry/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to stop tracking");
      }

      // Remove the entry from the local state
      setLeaderboard((prev) => prev.filter((entry) => entry.userId !== userId));
      setFilteredLeaderboard((prev) => prev.filter((entry) => entry.userId !== userId)); // Update filtered entries
    } catch (error) {
      setError("Error stopping tracking");
    }
  };

  // Fetch leaderboard on initial render
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Function to validate goal form
  const validateForm = () => {
    const newErrors = { metric: "", goal: "", interval: "" };
    let isValid = true;

    if (!metric) {
      newErrors.metric = "Metric is required.";
      isValid = false;
    }

    if (!goal || Number.isNaN(Number(goal))) {
      newErrors.goal = "Goal must be a number.";
      isValid = false;
    }

    if (!interval) {
      newErrors.interval = "Interval is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to handle goal creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data = { name: metric, goalInt: Number(goal), interval };

      const response = await fetch("http://localhost:8080/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Goal created successfully!");
      } else {
        console.error("Failed to create goal.");
      }
    }
  };

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
    <main className="">
      <InternalMenu>
        <div className="flex justify-between items-center mb-4">
          <h2>Leaderboard</h2>

          {/* Create Goal Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create Goal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Goal</DialogTitle>
                <DialogDescription>
                  You can create a Goal based on a common health metric and compete on a leaderboard!
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="metric" className="text-right">
                      Health Metric
                    </Label>
                    <Select onValueChange={setMetric}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="steps">Steps</SelectItem>
                          <SelectItem value="body_weight">Body Weight</SelectItem>
                          <SelectItem value="max_hr">Max Heart Rate</SelectItem>
                          <SelectItem value="calories">Calories Burned</SelectItem>
                          <SelectItem value="distance">Distance</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.metric && <p className="text-red-500">{errors.metric}</p>}
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal" className="text-right">
                      Goal
                    </Label>
                    <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="col-span-3" />
                    {errors.goal && <p className="text-red-500">{errors.goal}</p>}
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="interval" className="text-right">
                      Goal Interval
                    </Label>
                    <Select onValueChange={setInterval}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select an interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.interval && <p className="text-red-500">{errors.interval}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Start</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Input */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Enter Team ID"
            value={filterTeamId}
            onChange={(e) => setFilterTeamId(e.target.value)}
          />
          <Button onClick={handleFilter} style={{ marginLeft: "10px" }}>
            Filter
          </Button>
        </div>

        {/* Refresh Button */}
        <Button onClick={fetchLeaderboard} style={{ marginBottom: "10px" }}>
          Refresh
        </Button>

        <table border={1} cellPadding={10} cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Team ID</th>
              <th>Date</th>
              <th>Action</th>
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
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Stop Tracking
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InternalMenu>
    </main>
  );
};

export default Leaderboards;

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");

  const headers: HeadersInit = cookieHeader ? { Cookie: cookieHeader } : {};

  const response = await fetch("http://localhost:8080/verify-token", {
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    return redirect("/login");
  }

  const { userId } = await response.json();

  return { userId };
};
