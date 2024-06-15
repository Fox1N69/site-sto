"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { TableWrapper } from "@/components/table/table";
import { AddProduct } from "./add-product";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import Papa from "papaparse";
import { writeTextFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { TableWrapperProducts } from "./table/table";

interface Item {
  id: number;
  fio: string;
  branch: string;
  phoneNumber: string;
  email: string;
  lastVisti: string;
  [key: string]: number | string | boolean;
}

export const Products = () => {
  const fetchAndExportCSV = async () => {
    try {
      const response = await fetch(
        "https://api-deplom.onrender.com/api/product/"
      );
      const data = await response.json();

      // Добавим отладочный вывод для проверки данных перед форматированием в CSV
      console.log("Полученные данные:", data);

      const csvData = data.map((item: Item) => ({
        id: item.id,
        "ФИО Клиента": item.fio,
        Филиал: item.branch,
        "Номер телефона": item.phoneNumber,
        Почта: item.email,
        "Последний визит": item.lastVisit,
      }));

      console.log("Данные для CSV:", csvData);

      const csv = Papa.unparse(csvData, {
        header: true,
      });

      console.log("Сформированный CSV:", csv);

      const path = await save({ defaultPath: "заявки.csv" });
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
          <span>Товар</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Список</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Все клиенты</h3>
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
          <AddProduct />
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
        <TableWrapperProducts />
      </div>
    </div>
  );
};
