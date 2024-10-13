import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/vital-link";
import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: title() },
    {
      name: "description",
      content: "Login to BitFit!",
    },
  ];
};

export default function Settings() {
  const navigation = useNavigate();
  const [edit, isEdit] = useState(false);

  return (
    <>
      <Header />
      <main className="container w-1/3 space-y-6 py-8">
        <h3>Settings</h3>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <Label>Name</Label>
          <Input />
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input />
        </div>
        <div className="space-y-1">
          <Label>Password</Label>
          <Input />
        </div>
        <div className="space-y-1">
          <p>Health Providers</p>
          <LinkButton />
        </div>

        {edit ? (
          <div className="space-x-4">
            <Button>Submit</Button>
            <Button variant={"secondary"} onClick={() => isEdit(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-x-4">
            <Button onClick={() => isEdit(true)}>Edit</Button>
            <Button variant={"secondary"} onClick={() => navigation(-1)}>
              Back
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
