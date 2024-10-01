import { Header } from "@/components/header";
import { LoginForm } from "@/components/login-form";
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
