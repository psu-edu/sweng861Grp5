import { InternalMenu } from "@/components/internal-menu";
import { Button } from "@/components/ui/button";
import { title } from "@/config.shared";
import { type LoaderFunction, type MetaFunction, redirect } from "@remix-run/node";

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
