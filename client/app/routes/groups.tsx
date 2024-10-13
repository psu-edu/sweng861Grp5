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

export default function Groups() {
  return (
    <main className="">
      <InternalMenu>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => console.log("create a new group form page")}>Create Group</Button>
          <Button onClick={() => console.log("search for a group portal")}>Join Group</Button>
        </div>
      </InternalMenu>
    </main>
  );
}
