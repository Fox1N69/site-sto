import { Button, Input, Link, Navbar } from "@nextui-org/react";
import Image from "next/image";
import { SearchIcon } from "../icons/searchicon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { useAuth } from "../context/authContext";
import { UserDropdown } from "./user-dropdown";

export const Header = () => {
  const route = useRouter();

  const { isAuth } = useAuth();

  const handler = () => {
    route.push("/auth/login");
  };

  const handlerLogout = async () => {
    Cookies.remove("token");
    route.push("/");
  };

  return (
    <header className="flex justify-between w-[100%] items-center">
      <Navbar maxWidth="full">
        <Image src={"/next.svg"} alt={"logo"} width={100} height={100} />
        <ul className="header__list flex gap-4">
          <li>Главная</li>
          <li>Все товары</li>
          <li>Автосервис</li>
        </ul>
        <Input
          type="search"
          placeholder="Поиск..."
          className="w-[600px]"
          variant="bordered"
        />
        {!isAuth && (
          <Button
            onClick={handler}
            style={{ border: "1px solid black", borderRadius: 5 }}
          >
            Вход
          </Button>
        )}
        {isAuth && (
          <>
            <Button
              style={{
                border: "1px solid black",
                borderRadius: 5,
              }}
            >
              <ProductsIcon />
            </Button>
            <UserDropdown />
          </>
        )}
      </Navbar>
    </header>
  );
};
