const API_URL = "http://localhost:8080";

export const getTokenFromBackend = async (userID: string) => {
  const resp = await fetch(`${API_URL}/vital/token/${userID}`);
  const data = await resp.json();
  return data;
};

export const getUserConnectedProviderToBackend = async (userID: string) => {

  const resp = await fetch(`${API_URL}/vital/providers/${userID}`);
  const data = await resp.json();
  return data;
};

export const removeUserConnectedProviderToBackend = async (userID: string, provider: string) => {

  const resp = await fetch(`${API_URL}/vital/remove/${provider}/${userID}`);
  const data = await resp.json();
  return data;
};