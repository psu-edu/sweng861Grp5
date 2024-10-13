import { type ReactNode, createContext, useContext, useState } from "react";

export interface Idata {
  providers: Provider[]
}
export interface Provider {
  logo: string;
  name: string;
  slug: string;
  status: string;
  availability?: {};
}
export interface User {
  id: string | null;
  vitalUserID: string | null;
  vitalProviders: Provider[];
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: null,
    vitalUserID: null,
    vitalProviders: [],
  });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
