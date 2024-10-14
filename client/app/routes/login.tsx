import { Header } from "@/components/header";
import { LoginForm } from "@/components/login-form";
import { title } from "@/config.shared";
import { type ActionFunction, type MetaFunction, json, redirect } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: title() },
    {
      name: "description",
      content: "Login to BitFit!",
    },
  ];
};

export interface ActionData {
  errors?: {
    msg: string;
  }[];
}

export default function Login() {
  return (
    <>
      <Header />
      <main className="container prose py-8">
        <h1 className="text-5xl">BitFit</h1>
        <LoginForm />
      </main>
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

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

  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return json({ errors: errorData.errors }, { status: 400 });
  }

  const headers = response.headers;

  return redirect("/dashboard", { headers });
};
