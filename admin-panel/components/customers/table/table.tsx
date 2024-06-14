import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import { columns } from "./columns";
import { RenderCell } from "./render-cell";
import axios from "axios";
import { useAsyncList } from "@react-stately/data";

interface Client {
  fio: string;
  email: string;
  branch: string;
  phoneNumber: string;
  id: string;
  lastVisit: string;
  [key: string]: any;
}

export const TableWrapperClients = () => {
  const [selectedUser, setSelectedOrder] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const { isOpen, onOpen } = useDisclosure();
  const [clients, setClients] = useState([]);
  const [selectRow, setSelectRow] = useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    axios
      .get("https://api-deplom.onrender.com/api/client/")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, [editedUser]);

  const handleEditUser = (client: any) => {
    setEditedUser(client);
    onOpen();
  };

  const handleRowSelection = (row: any) => {
    setSelectRow(row);
  };

  const list = useAsyncList<Client>({
    async load({ signal }) {
      let res = await fetch("https://api-deplom.onrender.com/api/client/", {
        signal,
      });
      let json = await res.json();
      setIsLoading(false);
      return {
        items: json,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof Client];
          let second = b[sortDescriptor.column as keyof Client];
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
              allowsSorting
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={list.items}>
          {(item) => (
            <TableRow onClick={() => handleRowSelection(item)}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({
                    client: item,
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
