"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@components/icons/accounts/dots-icon";
import { ExportIcon } from "@components/icons/accounts/export-icon";
import { InfoIcon } from "@components/icons/accounts/info-icon";
import { TrashIcon } from "@components/icons/accounts/trash-icon";
import { UsersIcon } from "@components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@components/icons/sidebar/settings-icon";
import { TableWrapper } from "@components/table/table";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import Papa from "papaparse";
import { writeTextFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { SessionProvider, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { TableWrapperModels } from "./auto-table/table-model";
import { AddModel } from "./add-model";
import { Icon } from "@iconify/react";

interface ModelAutoProps {}

export const ModelAuto: React.FC<ModelAutoProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <SessionProvider>
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
            <Icon icon={"gravity-ui:car"} width={24} height={24} />
            <span>Машины</span>
            <span> / </span>{" "}
          </li>
          <li className="flex gap-2">
            <span>Модели авто</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold">Все модели машин</h3>
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
            <AddModel />
            <Button
              color="primary"
              startContent={<ExportIcon />}
              onClick={() => {}}
            >
              Экспорт CSV
            </Button>
          </div>
        </div>
        <div className="max-w-[95rem] mx-auto w-full">
          <TableWrapperModels />
        </div>
      </div>
    </SessionProvider>
  );
};
