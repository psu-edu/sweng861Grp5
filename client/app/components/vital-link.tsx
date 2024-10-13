import { Idata, Provider, type User, useUser } from "@/contexts/userContext";
import { useVitalLink } from "@tryvital/vital-link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getTokenFromBackend, getUserConnectedProviderToBackend } from "@/lib/fetchers";

export const LinkButton: React.FC = () => {
  const { user, setUser } = useUser();
  const userID = "64c76fad-5292-4761-aafe-5c0ab306ea72";
  
  const [isLoading, setLoading] = useState(false);

useEffect(() => {
  let isMounted = true; 

  async function dataFetch() {
    try {
      const data = await getUserConnectedProviderToBackend(userID);
      
      if (isMounted) {
        setUser(({
          ...user,
          vitalProviders: data.providers,
        } as User));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }


  dataFetch();

  return () => {
    isMounted = false;
  };
}, [userID]); 

  const onSuccess = async (metadata: string) => {

    // Device is now connected.
    console.log("onSuccess", metadata);

    const data: Promise<Idata> = await getUserConnectedProviderToBackend(userID);
    setUser({...user, vitalProviders: (await data).providers } as User)
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
