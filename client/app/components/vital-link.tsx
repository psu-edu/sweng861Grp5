import type { Idata } from "@/contexts/userContext";
import { getTokenFromBackend, getUserConnectedProviderToBackend } from "@/lib/fetchers";
import { useVitalLink } from "@tryvital/vital-link";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";

export const LinkButton = ({ userID }: { userID: string }) => {
  const [isLoading, setLoading] = useState(false);

  const onSuccess = async (metadata: string) => {
    // Device is now connected.
    console.log("onSuccess", metadata);

    const data: Promise<Idata> = await getUserConnectedProviderToBackend(userID);
    // setUser({...user, vitalProviders: (await data).providers } as User)
  };

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

  if (error) console.log(error);

  return (
    <Button onClick={handleVitalOpen} disabled={!userID}>
      {isLoading || !ready ? "Loading..." : "Connect"}
    </Button>
  );
};
