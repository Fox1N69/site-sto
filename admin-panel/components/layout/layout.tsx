import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { BranchProvider } from "../context/BranchContext";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <SessionProvider>
      <BranchProvider>
        <SidebarContext.Provider
          value={{
            collapsed: sidebarOpen,
            setCollapsed: handleToggleSidebar,
          }}
        >
          <section className="flex">
            <SidebarWrapper />
            <NavbarWrapper>{children}</NavbarWrapper>
          </section>
        </SidebarContext.Provider>
      </BranchProvider>
    </SessionProvider>
  );
};
