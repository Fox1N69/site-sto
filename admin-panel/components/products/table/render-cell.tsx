import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { EditProduct } from "../edit-product";
import { Product } from "@/types";
import { Span } from "next/dist/trace";

interface Props {
  product: Product;
  columnKey: keyof Product | "actions" | "category_name" | "brand_name";
  onEdit: (product: any) => void;
}

export const RenderCell = ({ product, columnKey, onEdit }: Props) => {
  const handleDelete = () => {
    fetch(`http://localhost:4000/admin/part/delete/${product.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
      })
      .catch((error) => {
        // Обработка ошибок
      });
  };

  // @ts-ignore
  const cellValue = product[columnKey];
  switch (columnKey) {
    case "name":
      return <User avatarProps={{}} name={cellValue}></User>;
    case "model_name":
      return <span>{cellValue}</span>;
    case "price":
      return <span>{cellValue}</span>;
    case "category_name":
      return <span>{cellValue}</span>;
    case "brand_name":
      return <span>{cellValue}</span>;

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Подробнее">
              <button onClick={() => console.log("View user", product.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <EditProduct product={product} selectedProductId={product.id} />
          </div>
          <div>
            <Tooltip
              content="Удалить"
              color="danger"
              onClick={() => console.log("Delete user", product.id)}
            >
              <button onClick={handleDelete}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
