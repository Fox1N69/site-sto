"use client";
import React, { Key, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { columns } from "./columns";
import { RenderCell } from "./render-cell";
import { useAsyncList } from "@react-stately/data";
import { ModelAuto } from "@/types";

export const TableWrapperModels = () => {
  const [editedUser, setEditedUser] = useState<ModelAuto | null>(null);
  const { isOpen, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const handleEditUser = (model: ModelAuto) => {
    setEditedUser(model);
    onOpen();
  };

  const flattenModels = (models: ModelAuto[]): ModelAuto[] => {
    return models.map((m) => ({
      ...m,
      brand_name: m.Brand?.name,
    }));
  };

  const list = useAsyncList<ModelAuto>({
    async load({ signal }) {
      let res = await fetch("http://localhost:4000/shop/modelautos", {
        signal,
      });
      let json = await res.json();

      const flatModel = flattenModels(json);
      setIsLoading(false);

      return { items: flatModel };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof ModelAuto];
          let second = b[sortDescriptor.column as keyof ModelAuto];
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

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/shop/model-auto/ws/all");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send("subscribeEvents");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const newAuto: ModelAuto = JSON.parse(event.data);
      list.insert(0, ...flattenModels([newAuto]));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [list]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
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
                  {RenderCell({
                    model: item,
                    columnKey,
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
