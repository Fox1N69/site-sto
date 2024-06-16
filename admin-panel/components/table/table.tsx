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
import { columns } from "../../store/data";
import { RenderCell } from "./render-cell";
import axios from "axios";
import { useAsyncList } from "@react-stately/data";
import { useSession } from "next-auth/react";

interface Order {
  fio: string;
  branch: string;
  storageCell: string;
  diskSize: string;
  arrivalDate: string;
  deliveryDate: string;
  price: string;
  isPaid: string;
  status: string;
  avatar: string;
  id: string;
  [key: string]: any;
}

interface TableWrapperProps {
  branch: string;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({ branch }) => {
  const [selectedUser, setSelectedOrder] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const { isOpen, onOpen } = useDisclosure();
  const [orders, setOrders] = useState([]);
  const [selectRow, setSelectRow] = useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const apiUrl = branch
      ? `https://api-deplom.onrender.com/api/crequest/branch/${branch}`
      : "https://api-deplom.onrender.com/api/crequest/";
    axios
      .get(apiUrl)
      .then((response) => {
        setOrders(response.data);
        console.log("Values for storageCell and diskSize:", response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, [branch, editedUser]);

  const handleEditUser = (order: any) => {
    setEditedUser(order);
    onOpen();
  };

  const handleRowSelection = (row: any) => {
    setSelectRow(row);
  };

  const list = useAsyncList<Order>({
    async load({ signal }) {
      let res = await fetch(
        `https://api-deplom.onrender.com/api/crequest/branch/${branch}`,
        {
          signal,
        }
      );
      let json = await res.json();
      setIsLoading(false);
      return {
        items: json,
      };
    },

    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof Order];
          let second = b[sortDescriptor.column as keyof Order];
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
                    order: item,
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
