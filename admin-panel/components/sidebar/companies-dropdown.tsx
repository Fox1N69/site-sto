"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { AcmeIcon } from "../icons/acme-icon";
import { BottomIcon } from "../icons/sidebar/bottom-icon";
import { useBranch } from "../context/BranchContext";

interface Company {
  name: string;
  location: string;
  logo: React.ReactNode;
}

export const CompaniesDropdown: React.FC<{
  onBranchChange: (branch: string) => void;
}> = ({ onBranchChange }) => {
  return (
    <Dropdown classNames={{ base: "w-full min-w-[260px]" }}>
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              RemZona
            </h3>
            <span className="text-xs font-medium text-default-500">
              мариуполь
            </span>
          </div>
          <BottomIcon />
        </div>
      </DropdownTrigger>

      <DropdownMenu aria-label="Avatar Actions">
        <DropdownSection title="Филиалы">
          <DropdownItem
            key="1"
            startContent={<AcmeIcon />}
            description="г. Тюмень"
            classNames={{
              base: "py-4",
              title: "text-base font-semibold",
            }}
            onClick={() => {}}
          >
            RemZona
          </DropdownItem>

          <DropdownItem
            key="2"
            startContent={<AcmeIcon />}
            description="г. Ишим"
            classNames={{
              base: "py-4",
              title: "text-base font-semibold",
            }}
            onClick={() => {}}
          >
            RemZona
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
