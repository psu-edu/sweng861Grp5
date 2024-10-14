import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/vital-link";
import { title } from "@/config.shared";
import type { Provider } from "@/contexts/userContext";
import { removeUserConnectedProviderToBackend } from "@/lib/fetchers";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import type { LoaderData, UserInfo } from "./dashboard";

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
  const [edit, setEdit] = useState(false);
  const { userInfo, userId } = useLoaderData<LoaderData>();
  const [userData, setUserData] = useState({
    first: userInfo.username.split("_")[0],
    last: userInfo.username.split("_")[1],
    email: userInfo.email,
    password: userInfo.password,
  });

  async function removeConnection(provider: string) {
    const data = await removeUserConnectedProviderToBackend(userId, provider);
    // Handle removal logic here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Updated User Data:", userData);
  };

  return (
    <>
      <Header />
      <main className="container w-1/3 space-y-6 py-8">
        <h3>Settings</h3>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="first">First Name</Label>
            <Input id="first" name="first" value={userData.first} onChange={handleInputChange} disabled={!edit} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="last">Last Name</Label>
            <Input id="last" name="last" value={userData.last} onChange={handleInputChange} disabled={!edit} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={userData.email} onChange={handleInputChange} disabled={!edit} />
          </div>
          {edit && (
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="space-y-1">
            <p>Health Providers</p>
            {userInfo?.providers && userInfo.providers.length > 0 && (
              <div className="flex space-x-2 py-5">
                {userInfo.providers.map((provider: Provider, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img src={provider.logo} alt={provider.name} width={30} height={25} />
                    {edit && (
                      <Badge
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => removeConnection(provider.slug)}
                      >
                        X
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            <LinkButton userID={userInfo.vitalUserId as string} />
          </div>

          {edit ? (
            <div className="space-x-4">
              <Button type="submit">Submit</Button>
              <Button type="button" variant={"secondary"} onClick={() => setEdit(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-x-4">
              <Button type="button" onClick={() => setEdit(true)}>
                Edit
              </Button>
              <Button type="button" variant={"secondary"} onClick={() => navigation(-1)}>
                Back
              </Button>
            </div>
          )}
        </form>
      </main>
    </>
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

  const userResponse = await fetch(`http://localhost:8080/users/${userId}`, {
    headers,
    credentials: "include",
  });

  if (!userResponse.ok) {
    return redirect("/login");
  }

  const userInfo: UserInfo = await userResponse.json();

  return { userId, userInfo };
};
