"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  SortDescriptor,
} from "@nextui-org/react";
import React, {
  Key,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { columns } from "./columns";
import { RenderCell } from "./render-cell";
import { ModelAuto } from "@/types";

export const TableWrapperModels: React.FC = () => {
  const [editedUser, setEditedUser] = useState<ModelAuto | null>(null);
  const { isOpen, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState<ModelAuto[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<
    SortDescriptor | undefined
  >(undefined);
  const websocketRef = useRef<WebSocket | null>(null);

  const handleEditUser = (model: ModelAuto) => {
    setEditedUser(model);
    onOpen();
  };

  const flattenModels = (models: ModelAuto[]): ModelAuto[] => {
    return models.map((model) => ({
      ...model,
      brand_name: model.Brand?.name,
    }));
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/ws/model-auto");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(JSON.stringify({ type: "getAllModel" }));
      ws.send(JSON.stringify({ type: "subscribeEvents" }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data: ", data);

        if (data.type === "allModels") {
          const flatModels = flattenModels(data.models);
          setModels(flatModels);
          setIsLoading(false);
        }
        if (data.type === "newModelAdded" && data.model) {
          const newModel = data.model;
          const updateModel = {
            ...newModel,
            brand_name: newModel.Brand?.name,
          };
          setModels((prevModels) => [...prevModels, updateModel]);
        }
        if (data.type === "modelDeleted" && data.modelID) {
          setModels((prevModels) =>
            prevModels.filter((model) => model.id !== data.modelID)
          );
        }
      } catch (error) {
        console.error("Failed to parse message: ", event.data, error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
      setIsLoading(false);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket connection closed: ", event);
      setIsLoading(false);
    };

    websocketRef.current = ws;

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  console.log(models);

  const sortData = useCallback(
    (items: ModelAuto[], sortDescriptor: SortDescriptor | null) => {
      if (!sortDescriptor) return items;

      return items.sort((a, b) => {
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
      });
    },
    []
  );

  const sortedModels = useMemo(
    () => sortData(models, sortDescriptor!),
    [models, sortDescriptor, sortData]
  );
  const handleSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Table
        aria-label="Example table with custom cells"
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
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
        <TableBody items={sortedModels}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey: Key) => (
                <TableCell>
                  {RenderCell({
                    model: item,
                    columnKey: columnKey,
                    onEdit: handleEditUser,
                    websocketRef: websocketRef,
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
