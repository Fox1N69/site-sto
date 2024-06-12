// context/UserContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie"; // Assuming you use cookies for storing JWT token

interface User {
  id: string;
  username: string;
  roles: string[];
}

interface UserContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      // Decode token and set user data
      const userData = decodeToken(token);
      setUser(userData);
    }
  }, []);

  const login = (token: string) => {
    const userData = decodeToken(token);
    setUser(userData);
    Cookies.set("token", token); // Store token in cookie
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("token"); // Remove token from cookie
  };

  const decodeToken = (token: string): User => {
    // Decode token and extract user data
    // Example implementation, replace with your actual decoding logic
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return {
      id: decodedToken.sub,
      username: decodedToken.username,
      roles: decodedToken.roles,
    };
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
