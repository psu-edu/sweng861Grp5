import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Leaderboards() {
  const [metric, setMetric] = useState("");
  const [goal, setGoal] = useState("");
  const [interval, setInterval] = useState("");
  const [errors, setErrors] = useState({ metric: "", goal: "", interval: "" });

  const validateForm = () => {
    const newErrors = { metric: "", goal: "", interval: "" };
    let isValid = true;

    if (!metric) {
      newErrors.metric = "Metric is required.";
      isValid = false;
    }

    if (!goal || isNaN(Number(goal))) {
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

  return (
    <main className="">
      <InternalMenu>
        <div className="flex flex-col space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create Goal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Goal</DialogTitle>
                <DialogDescription>
                  You can create a Goal based on a common health metric and
                  compete on a leaderboard!
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
                          <SelectItem value="body_weight">
                            Body Weight
                          </SelectItem>
                          <SelectItem value="max_hr">Max Heart Rate</SelectItem>
                          <SelectItem value="calories">
                            Calories Burned
                          </SelectItem>
                          <SelectItem value="distance">Distance</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.metric && (
                      <p className="text-red-500">{errors.metric}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal" className="text-right">
                      Goal
                    </Label>
                    <Input
                      id="goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="col-span-3"
                    />
                    {errors.goal && (
                      <p className="text-red-500">{errors.goal}</p>
                    )}
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
                    {errors.interval && (
                      <p className="text-red-500">{errors.interval}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Start</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </InternalMenu>
    </main>
  );
}
