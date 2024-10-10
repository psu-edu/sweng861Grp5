import { InternalMenu } from "@/components/internal-menu";
import { Button } from "@/components/ui/button";
import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: title() },
    {
      name: "description",
      content: "Login to BitFit!",
    },
  ];
};

export default function Leaderboards() {
  return (
    <main className="">
      <InternalMenu>
        <Button onClick={() => console.log("create a goal portal")}>Create Goal</Button>
      </InternalMenu>
    </main>
  );
}
