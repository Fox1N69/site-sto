"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { Key, useState } from "react";
import { columns } from "./columns";
import { RenderCellBrand } from "./render-cell";
import { useAsyncList } from "@react-stately/data";
import { Brand, Category } from "@/types";

export const TableWrapperCategories = () => {
  const [editedUser, setEditedUser] = useState(null);
  const { isOpen, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleEditUser = (category: any) => {
    setEditedUser(category);
    onOpen();
  };

  const list = useAsyncList<Category>({
    async load({ signal }) {
      let res = await fetch("http://localhost:4000/shop/categorys", {
        signal,
      });
      let json = await res.json();

      const data = json;
      setIsLoading(false);

      return {
        items: data,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof Category];
          let second = b[sortDescriptor.column as keyof Category];
          if (first == null || second == null) {
            return 0;
          }
          if (
            typeof first === "string" &&
            typeof second === "string" &&
            /^\d/.test(first) &&
            /^\d/.test(second)
          ) {
            first = parseInt(first.replace(/\D/g, ""), 10);
            second = parseInt(second.replace(/\D/g, ""), 10);
          }
          if (first < second) {
            return sortDescriptor.direction === "ascending" ? -1 : 1;
          } else if (first > second) {
            return sortDescriptor.direction === "ascending" ? 1 : -1;
          } else {
            return 0;
          }
        }),
      };
    },
  });

  return (
    <div className=" w-full flex flex-col gap-4">
      <Table
        aria-label="Example table with custom cells"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
              style={{
                width: column.uid === "actions" ? "8rem" : "fit-content",
              }}
              allowsSorting
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={list.items}>
          {(item) => (
            <TableRow>
              {(columnKey: Key) => (
                <TableCell>
                  {RenderCellBrand({
                    category: item,
                    columnKey: columnKey,
                    onEdit: handleEditUser,
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
