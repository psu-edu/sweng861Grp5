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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ActionFunction, type LoaderFunction, redirect } from "@remix-run/node";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import type React from "react";
import { useState } from "react";

// Define the structure of a leaderboard entry, now with a userId
interface LeaderboardEntry {
  name: string;
  score: number;
  teamId: string; // teamId for filtering
  date: string;
  userId: string;
}

interface Loader {
  leaderboard: LeaderboardEntry[];
  userId: string;
}

interface ActionData {
  errors?: { interval: string; metric: string };
  success?: boolean;
}

const Leaderboards: React.FC = () => {
  // Leaderboard states
  const { leaderboard } = useLoaderData<Loader>();
  const actionData = useActionData<ActionData>();

  const [filterTeamId, setFilterTeamId] = useState<string>(""); // State for the filter input
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]); // State for filtered entries

  // Function to handle filtering by teamId
  const handleFilter = () => {
    if (filterTeamId) {
      const filteredEntries = leaderboard.filter((entry: LeaderboardEntry) => entry.teamId === filterTeamId);
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
      // setLeaderboard((prev) => prev.filter((entry) => entry.userId !== userId));
      setFilteredLeaderboard((prev) => prev.filter((entry) => entry.userId !== userId)); // Update filtered entries
    } catch (error) {
      console.error("Error stopping tracking");
    }
  };

  // // Function to format the date
  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString();
  // };
  //
  // Fake Data
  const team = {
    teamName: "The Best",
    users: ["Josh", "Race", "Chad", "Ben"],
  };

  return (
    <main className="">
      <InternalMenu>
        <div className="flex justify-between items-center mb-4">
          {/* Create Goal Button */}
          {leaderboard.length > 0 ? (
            <Table className="w-full">
              <TableCaption>Team {team.teamName} Steps Leaderboard</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead className="text-right">Steps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaderboard.map((entry) => (
                  <TableRow key={entry.userId}>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell className="text-right">{entry.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">10,000</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          ) : (
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
                <Form method="post">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="metric" className="text-right">
                        Health Metric
                      </Label>
                      <Select name="metric">
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
                      {actionData?.errors?.metric && <p className="text-red-500">{actionData.errors.metric}</p>}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="interval" className="text-right">
                        Goal Interval
                      </Label>
                      <Select name="interval">
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
                      {actionData?.errors?.interval && <p className="text-red-500">{actionData.errors.interval}</p>}
                    </div>

                    {/* Show a success message if the goal creation is successful */}
                    {actionData?.success && <p className="text-green-500">Goal created successfully!</p>}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Start</Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          {/* Filter Input */}
          {/* <div style={{ marginBottom: "10px" }}> */}
          {/*   <input */}
          {/*     type="text" */}
          {/*     placeholder="Enter Team ID" */}
          {/*     value={filterTeamId} */}
          {/*     onChange={(e) => setFilterTeamId(e.target.value)} */}
          {/*   /> */}
          {/*   <Button onClick={handleFilter} style={{ marginLeft: "10px" }}> */}
          {/*     Filter */}
          {/*   </Button> */}
          {/* </div> */}
        </div>
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

  const responseLeaderboard = await fetch("http://localhost:8080/leaderboard", {
    headers,
    credentials: "include",
  });

  if (!responseLeaderboard.ok) {
    throw new Error("Network response was not ok");
  }
  const leaderboard: LeaderboardEntry[] = await responseLeaderboard.json();

  return { userId, leaderboard };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const metric = formData.get("metric");
  const interval = formData.get("interval");
  const cookieHeader = request.headers.get("Cookie");

  // Prepare headers for the backend request
  const headers: HeadersInit = cookieHeader ? { Cookie: cookieHeader } : {};

  // Validate form inputs
  if (typeof metric !== "string" || typeof interval !== "string") {
    return json(
      {
        errors: {
          metric: "Please select a valid metric.",
          interval: "Please select a valid interval.",
        },
      },
      { status: 400 },
    );
  }

  // Call the backend service
  const response = await fetch("http://localhost:8080/goals", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name: metric, interval }),
  });

  // Handle error from backend
  if (!response.ok) {
    const errorData = await response.json();
    return json({ errors: errorData.errors }, { status: 400 });
  }

  // If successful, return the success flag (no redirect)
  return json({ success: true });
};
