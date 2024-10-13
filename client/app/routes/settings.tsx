import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/vital-link";
import { title } from "@/config.shared";
import { Idata, Provider, User, useUser } from "@/contexts/userContext";
import {
  getUserConnectedProviderToBackend,
  removeUserConnectedProviderToBackend,
} from "@/lib/fetchers";
import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

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
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const userID = "64c76fad-5292-4761-aafe-5c0ab306ea72";

  async function removeConnection(provider: string) {
    const data = await removeUserConnectedProviderToBackend(userID, provider);
    // Handle removal logic here
  }

  useEffect(() => {
    let isMounted = true;

    async function dataFetch() {
      try {
        const data = await getUserConnectedProviderToBackend(userID);

        if (isMounted) {
          setUser({
            ...user,
            vitalProviders: data.providers,
          } as User);

          // Prefill form with user data (fake data for now)
          setUserData({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
          });
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    dataFetch();

    return () => {
      isMounted = false;
    };
  }, [userID, setUser]);

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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              disabled={!edit}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled={!edit}
            />
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
            {user && user.vitalProviders.length > 0 && (
              <div className="flex space-x-2 py-5">
                {user.vitalProviders.map((
                  provider: Provider,
                  index: number,
                ) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      width={30}
                      height={25}
                    />
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
            <LinkButton />
          </div>

          {edit
            ? (
              <div className="space-x-4">
                <Button type="submit">Submit</Button>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </Button>
              </div>
            )
            : (
              <div className="space-x-4">
                <Button type="button" onClick={() => setEdit(true)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={() => navigation(-1)}
                >
                  Back
                </Button>
              </div>
            )}
        </form>
      </main>
    </>
  );
}
