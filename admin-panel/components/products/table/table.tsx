import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { Key, useEffect, useMemo, useState } from "react";
import { columns } from "./columns";
import { RenderCell } from "./render-cell";
import axios from "axios";
import { useAsyncList } from "@react-stately/data";
import { Product } from "@/types";

export const TableWrapperProducts = () => {
  const [selectedUser, setSelectedOrder] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const { isOpen, onOpen } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectRow, setSelectRow] = useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const flattenProducts = (products: any[]): Product[] => {
    return products.map((product) => ({
      ...product,
      category_name: product.Category?.name,
      brand_name: product.Brand?.name,
    }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/shop/autoparts")
      .then((response) => {
        const flatProduct = flattenProducts(response.data);
        setProducts(flatProduct);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, [editedUser]);

  const handleEditUser = (product: any) => {
    setEditedUser(product);
    onOpen();
  };

  const handleRowSelection = (row: any) => {
    setSelectRow(row);
  };

  const list = useAsyncList<Product>({
    async load({ signal }) {
      let res = await fetch("http://localhost:4000/shop/autoparts", {
        signal,
      });
      let json = await res.json();

      const flatProducts = flattenProducts(json);
      setIsLoading(false);

      return {
        items: flatProducts,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof Product];
          let second = b[sortDescriptor.column as keyof Product];
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
              {(columnKey: Key) => (
                <TableCell>
                  {RenderCell({
                    product: item,
                    columnKey: columnKey as
                      | keyof Product
                      | "actions"
                      | "for_years",
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
