"use client";
import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { EditProduct } from "../edit-product";
import { Category, Product } from "@/types";
import { Span } from "next/dist/trace";
import { useSession } from "next-auth/react";
import { deleteProduct } from "@/utils/fetching";
import DeleteButton from "./delete-button";

interface Props {
  product: Product;
  columnKey:
    | keyof Product
    | "actions"
    | "category_name"
    | "brand_name"
    | "for_years";
  onEdit: (product: any) => void;
}

export const RenderCell: React.FC<Props> = ({
  product,
  columnKey,
  onEdit,
}: Props) => {
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
      return (
        <span className="flex gap-2 items-center">
          {product.categories.map((category: Category, index: number) => (
            <Chip variant="faded" key={index}>
              {category.name}
            </Chip>
          ))}
        </span>
      );
    case "brand_name":
      return <span>{cellValue}</span>;
    case "for_years":
      return (
        <div className="flex gap-2">
          {product.for_years.map((year, index) => (
            <Chip key={index} size="sm" variant="bordered" color="primary">
              {year}
            </Chip>
          ))}
        </div>
      );

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
              <DeleteButton productId={product.id} />
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
