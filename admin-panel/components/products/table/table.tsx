import React, {
  Key,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { columns } from "./columns";
import { RenderCell } from "./render-cell";
import { Product } from "@/types";

export const TableWrapperProducts: React.FC = () => {
  const [editedUser, setEditedUser] = useState<Product | null>(null);
  const { isOpen, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null
  ); // Change undefined to null for initial state
  const websocketRef = useRef<WebSocket | null>(null);

  const handleEditUser = (product: Product) => {
    setEditedUser(product);
    onOpen();
  };

  const flattenProducts = (products: Product[]): Product[] => {
    return products.map((product) => {
      const categories = product.categories
        ?.map((category: { name: string }) => category.name)
        .join(", ");
      const brandName = product.Brand?.name;

      return {
        ...product,
        category_name: categories || "", // Предоставляйте значение по умолчанию, если категории не определены
        brand_name: brandName || "", // Предоставляйте значение по умолчанию, если brandName не определено
      };
    });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/ws/auto-part");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(JSON.stringify({ type: "getAllAutoParts" }));
      ws.send(JSON.stringify({ type: "subscribeEvents" }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data: ", data);

        if (data.type === "allAutoParts") {
          const flatProducts = flattenProducts(data.parts);
          setProducts(flatProducts);
          setIsLoading(false);
        }
        if (data.type === "newPartAdded" && data.part) {
          const newPart = data.part;
          const updatedPart = {
            ...newPart,
            brand_name: newPart.Brand?.name,
            category_name: newPart.categories
              ?.map((category: { name: string }) => category.name)
              .join(", "),
          };
          setProducts((prevProducts) => [...prevProducts, updatedPart]);
        }
        if (data.type === "partDeleted" && data.partID) {
          setProducts((prevProducts) =>
            prevProducts.filter((part) => part.id !== data.partID)
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

  const sortData = useCallback(
    (items: Product[], sortDescriptor: SortDescriptor | null) => {
      if (!sortDescriptor) return items;

      return items.slice().sort((a, b) => {
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
      });
    },
    []
  );

  const sortedProducts = useMemo(
    () => sortData(products, sortDescriptor),
    [products, sortDescriptor, sortData]
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
        sortDescriptor={sortDescriptor!}
        onSortChange={handleSortChange}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"} // Adjust this condition if necessary
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
        <TableBody items={sortedProducts}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey: Key) => (
                <TableCell>
                  {RenderCell({
                    product: item,
                    columnKey: columnKey as keyof Product | "actions", // Ensure columnKey matches your column definition
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
