"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { TableWrapper } from "@/components/table/table";
import { AddOrders } from "./add-order";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import Papa from "papaparse";
import { writeTextFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { useBranch } from "../context/BranchContext";

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

export const Orders = () => {
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api-deplom.onrender.com/api/crequest/"
      );
      const data: Item[] = await response.json();
      setItems(data);
      setFilteredItems(data);
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const fetchAndExportCSV = async () => {
    try {
      const response = await fetch(
        "https://api-deplom.onrender.com/api/crequest/"
      );
      const data = await response.json();

      console.log("Полученные данные:", data);

      const csvData = data.map((item: Item) => ({
        id: item.id,
        "ФИО Клиента": item.fio,
        Филиал: item.branch,
        "Ячейка хранения": item.storageCell,
        "Радиус диска": item.diskSize,
        "Дата поступления": formatDate(item.arrivalDate),
        "Дата возврата": formatDate(item.deliveryDate),
        Цена: item.price,
        Оплата: item.isPaid,
        "Статус получения": item.status,
      }));

      console.log("Данные для CSV:", csvData);

      const csv = Papa.unparse(csvData, {
        header: true,
      });

      console.log("Сформированный CSV:", csv);

      const path = await save({
        defaultPath: "Заявки для хранения всех филиалов.csv",
      });
      if (path) {
        await writeTextFile(path, csv);
        console.log("Файл успешно сохранен по пути:", path);
      } else {
        console.error(
          "Отменено пользователем или не удалось получить путь для сохранения"
        );
      }
    } catch (error) {
      console.error("Ошибка при экспорте данных:", error);
    }
  };
  const handleSearchChange = (value: any) => {
    setSearchValue(value);
  };

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

  const { branch, setBranch } = useBranch();

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
          <UsersIcon />
          <span>Заявки</span>
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
          <AddOrders />
          <Button
            color="primary"
            startContent={<ExportIcon />}
            onClick={fetchAndExportCSV}
          >
            Экспорт CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper branch={branch} />
      </div>
    </div>
  );
};
