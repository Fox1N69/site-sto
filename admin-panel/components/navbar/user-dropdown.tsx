import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";
import { DarkModeSwitch } from "./darkmodeswitch";

export const UserDropdown = () => {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Авторизован как</p>
          <p>zoey@example.com</p>
        </DropdownItem>
        <DropdownItem key="settings">Настройки</DropdownItem>
        <DropdownItem key="system">Система</DropdownItem>
        <DropdownItem key="configurations">Конфигурация</DropdownItem>
        <DropdownItem key="help_and_feedback">Помощь и обратная связь</DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger ">
          Выйти
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
