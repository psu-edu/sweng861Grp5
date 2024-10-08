import { Header } from "@/components/header";
import { SignUpForm } from "@/components/signup-form";
import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";

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
