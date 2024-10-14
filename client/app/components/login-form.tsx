import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionData } from "@/routes/login";
import { Form, useActionData } from "@remix-run/react";

export function LoginForm() {
  const actionData = useActionData<ActionData>();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle data-testid="login" className="text-2xl">
          Login
        </CardTitle>
        <CardDescription>Let's get a BitFit</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="rhendricks@pidepiper.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="/" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" name="password" required />
          </div>

          {/* Error message display */}
          {actionData?.errors?.map((error, index: number) => (
            <div key={index} className="text-red-500 text-sm">
              {error.msg}
            </div>
          ))}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/" className="underline">
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
