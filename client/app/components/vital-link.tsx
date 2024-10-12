import { type User, useUser } from "@/contexts/userContext";
import { useVitalLink } from "@tryvital/vital-link";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";

const API_URL = "http://localhost:8080";

const getTokenFromBackend = async (userID: string) => {
  const resp = await fetch(`${API_URL}/vital/token/${userID}`);
  const data = await resp.json();
  return data;
};

export const LinkButton: React.FC = () => {
  const userID = "64c76fad-5292-4761-aafe-5c0ab306ea72";
  const { user, setUser } = useUser();
  const [isLoading, setLoading] = useState(false);

  const onSuccess = useCallback((metadata: string, user: User, setUser: (user: User | null) => void) => {
    // Device is now connected.
    console.log("onSuccess", metadata);
    // TODO Request to update user with their connected provider in db
    setUser({ ...user, vitalProviders: [{}] } as User);
    // TODO  Update User Context and retrieve data from Provider
  }, []);

  const onExit = useCallback((metadata: string) => {
    // User has quit the link flow.
    console.log("onExit", metadata);
  }, []);

  const onError = useCallback((metadata: string) => {
    // Error encountered in connecting device.
    console.log("onError", metadata);
  }, []);

  const config = {
    onSuccess,
    onExit,
    onError,
    env: "sandbox",
    region: "us",
  };

  const { open, ready, error } = useVitalLink(config);

  const handleVitalOpen = async () => {
    setLoading(true);
    const token = await getTokenFromBackend(userID);
    open(token.linkToken);
    setLoading(false);
  };

  console.log(error);

  return (
    <Button onClick={handleVitalOpen} disabled={!userID}>
      {isLoading || !ready ? "Loading..." : "Connect"}
    </Button>
  );
};
