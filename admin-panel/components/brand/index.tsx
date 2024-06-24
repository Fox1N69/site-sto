"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { DotsIcon } from "@components/icons/accounts/dots-icon";
import { ExportIcon } from "@components/icons/accounts/export-icon";
import { InfoIcon } from "@components/icons/accounts/info-icon";
import { TrashIcon } from "@components/icons/accounts/trash-icon";
import { UsersIcon } from "@components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@components/icons/sidebar/settings-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import Papa from "papaparse";
import { writeTextFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { useBranch } from "../context/BranchContext";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { TableWrapperBrands } from "./brand-table/table-brand";

interface Item {
  id: number;
  fio: string;
  branch: string;
  storageCell: string;
  diskSize: string;
  arrivalDate: string;
  deliveryDate: string;
  price: number;
  isPaid: boolean;
  status: string;
  [key: string]: number | string | boolean;
}

export const Brands = () => {
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredItems(items);
    } else {
      const filteredData = items.filter((item) =>
        item.fio.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredItems(filteredData);
    }
  }, [searchValue, items]);

  return (
    <div className="my-14 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Главная</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <BalanceIcon />
          <span>Бренды</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Список</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Все заявки</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search users"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" startContent={<ExportIcon />}>
            Экспорт CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapperBrands />
      </div>
    </div>
  );
};
