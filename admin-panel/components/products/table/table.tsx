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
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null
  );
  const websocketRef = useRef<WebSocket | null>(null);

  const handleEditUser = (product: Product) => {
    setEditedProduct(product);
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
        category_name: categories || "",
        brand_name: brandName || "",
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
          const flatProducts = flattenProducts(data.autoParts);
          setProducts(flatProducts);
          setIsLoading(false);
        } else if (data.type === "newAutoPartAdded" && data.autoPart) {
          const newAutoPart = data.autoPart;
          console.log("New AutoPart Received: ", newAutoPart);

          const updatedPart = {
            ...newAutoPart,
            brand_name: newAutoPart.Brand?.name || "",
            category_name:
              newAutoPart.categories
                ?.map((category: { name: string }) => category.name)
                .join(", ") || "",
          };

          setProducts((prevProducts) => [...prevProducts, updatedPart]);
        } else if (data.type === "autoPartDeleted" && data.autoPartID) {
          setProducts((prevProducts) =>
            prevProducts.filter((part) => part.id !== data.autoPartID)
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
        <TableBody items={sortedProducts}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey: Key) => (
                <TableCell>
                  {RenderCell({
                    product: item,
                    columnKey: columnKey as keyof Product | "actions",
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
