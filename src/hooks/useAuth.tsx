import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  user: null;
  session: null;
  isAdmin: false;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// AuthProvider stub - authentication and DB have been removed.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const value: AuthContextType = {
    user: null,
    session: null,
    isAdmin: false,
    isLoading: false,
    signOut: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
