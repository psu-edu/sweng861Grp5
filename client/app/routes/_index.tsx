import { Header } from "@/components/header";
import { SignUpForm } from "@/components/signup-form";
import { title } from "@/config.shared";
import { type ActionFunction, type MetaFunction, json, redirect } from "@remix-run/node";
import type { ActionData } from "./login";

export const meta: MetaFunction = () => {
  return [
    { title: title() },
    {
      name: "description",
      content: "Welcome to BitFit!",
    },
  ];
};

export default function Index() {
  return (
    <>
      <Header />
      <main className="container prose py-8">
        <h1 className="text-5xl">BitFit</h1>
        <SignUpForm />
      </main>
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const first = formData.get("first-name");
  const last = formData.get("last-name");

  console.log(formData);

  const username = `${first}_${last}`;

  if (typeof email !== "string" || typeof password !== "string") {
    return json<ActionData>(
      {
        errors: [{ msg: "Invalid email or password" }],
      },
      {
        status: 400,
      },
    );
  }

  const response = await fetch("http://localhost:8080/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, username }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return json({ errors: errorData.errors }, { status: 400 });
  }

  const headers = response.headers;

  return redirect("/dashboard", { headers });
};
