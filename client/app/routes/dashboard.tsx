import { Charts } from "@/components/charts";
import { InternalMenu } from "@/components/internal-menu";
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

export default function Dash() {
  return (
    <main className="">
      <InternalMenu>
        <Charts />
      </InternalMenu>
    </main>
  );
}
