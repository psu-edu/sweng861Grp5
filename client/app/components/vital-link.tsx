import { useVitalLink } from "@tryvital/vital-link";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";

const API_URL = "http://0.0.0.0:8000";

const getTokenFromBackend = async (userID: string) => {
  const resp = await fetch(`${API_URL}/token/${userID}`);
  const data = await resp.json();
  return data;
};

export const LinkButton: React.FC<{ userID: string }> = ({ userID }) => {
  const [isLoading, setLoading] = useState(false);

  const onSuccess = useCallback((metadata: string) => {
    // Device is now connected.
    console.log("onSuccess", metadata);
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
    open(token.link_token);
    setLoading(false);
  };

  console.log(error);

  return (
    <Button onClick={handleVitalOpen} disabled={userID ? false : true}>
      {isLoading || !ready ? "Loading..." : "Connect"}
    </Button>
  );
};
