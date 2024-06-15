import React, { useState } from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { TableWrapper } from "../table/table";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const [branch, setBranch] = useState("Тюмень"); // Инициализируем значение филиала

  const handleBranchChange = (newBranch: string) => {
    setBranch(newBranch);
  };

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown onBranchChange={handleBranchChange} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Статистика"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Основное">
              <SidebarItem
                isActive={pathname === "/accounts"}
                title="Заявки"
                icon={<AccountsIcon />}
                href="accounts"
              />
              <SidebarItem
                isActive={pathname === "/payments"}
                title="Бюджет"
                icon={<PaymentsIcon />}
              />
              <SidebarItem
                isActive={pathname === "/products"}
                title="Товар"
                icon={<CustomersIcon />}
                href="product"
              />
              <SidebarItem
                isActive={pathname === "/reports"}
                title="Отчеты"
                icon={<ReportsIcon />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Настройки"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Фильтр"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
