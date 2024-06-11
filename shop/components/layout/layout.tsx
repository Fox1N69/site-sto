import React from "react";
import { useLockedBody } from "../../makar-deplom/components/hooks/useBodyLock";
import { NavbarWrapper } from "../../makar-deplom/components/navbar/navbar";
import { SidebarWrapper } from "../../makar-deplom/components/sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { BranchProvider } from "../../makar-deplom/components/context/BranchContext";

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
  );
};
