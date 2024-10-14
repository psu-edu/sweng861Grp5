import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionData } from "@/routes/login";
import { Form, useActionData } from "@remix-run/react";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export function SignUpForm() {
  const actionData = useActionData<ActionData>();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" name="first-name" placeholder="Richard" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" name="last-name" placeholder="Hendricks" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="rhendricks@pidepiper.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {/* Error message display */}
          {actionData?.errors?.map((error, index) => (
            <div key={index} className="text-red-500 text-sm">
              {error.msg}
            </div>
          ))}
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Sign in
          </a>
        </div>
        <p className="text-xs">
          By clicking Create an account, you agree to our{" "}
          <a href="/" className="underline">
            Terms of Service
          </a>{" "}
          and{"  "}
          <a href="/" className="underline">
            Privacy Policy.
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
