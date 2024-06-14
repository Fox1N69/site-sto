import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface BranchContextProps {
  branch: string;
  setBranch: (branch: string) => void;
}

interface BranchProviderProps {
  children: ReactNode;
}

const BranchContext = createContext<BranchContextProps>({
  branch: "tumen",
  setBranch: () => {}, // Provide a default implementation if needed
});

export const BranchProvider: React.FC<BranchProviderProps> = ({ children }) => {
  const [branch, setBranch] = useState("Тюмень");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBranch = localStorage.getItem("selectedCompany");
      if (savedBranch) {
        setBranch(JSON.parse(savedBranch).location);
      }
    }
  }, []);

  return (
    <BranchContext.Provider value={{ branch, setBranch }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  return useContext(BranchContext);
};
