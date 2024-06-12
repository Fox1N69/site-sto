import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Switch } from "@nextui-org/switch";
import { ThemeSwitch } from "../theme-switch";
import { UserInfo } from "os";
import { User } from "@/types";
import axios from "axios";

interface Props {
  user: User;
}

export const UserDropdown: React.FC<Props> = ({ user }) => {
  const [username, setUsername] = useState<string>("");
  const route = useRouter();
  const handlerLogout = () => {
    Cookies.remove("token");
    route.push("/auth/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get<string>(
          `http://localhost:4000/v1/account/user/${user.id}`,
          config
        );
        const data = response.data;

        setUsername(data);
      } catch (error) {
        console.error("Error fetching auto parts data:", error);
      }
    };

    fetchData();
  }, []);

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
          <p>{username}</p>
        </DropdownItem>
        <DropdownItem key="settings">Настройки</DropdownItem>
        <DropdownItem key="system">Система</DropdownItem>
        <DropdownItem key="configurations">Конфигурация</DropdownItem>
        <DropdownItem key="help_and_feedback">
          Помощь и обратная связь
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          onClick={handlerLogout}
        >
          Выйти
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
