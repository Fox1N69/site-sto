"use client";
import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { EyeIcon } from "../../icons/table/eye-icon";
import { EditProduct } from "../edit-product";
import { Category, Product } from "@/types";
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
  websocketRef: React.MutableRefObject<WebSocket | null>;
}

export const RenderCell: React.FC<Props> = ({
  product,
  columnKey,
  onEdit,
  websocketRef,
}: Props) => {
  switch (columnKey) {
    case "name":
      return <User avatarProps={{}} name={product.name} />;
    case "model_name":
      return <span>{product.model_name}</span>;
    case "price":
      return <span>{product.price}</span>;
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
      return <span>{product.brand_name}</span>;
    case "stock":
      return <span>{product.stock}</span>;
    case "for_years":
      return (
        <div className="flex gap-2">
          {Array.isArray(product.for_years) &&
            product.for_years.map((year: number, index) => (
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
              <button onClick={() => onEdit(product)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <EditProduct product={product} selectedProductId={product.id} />
          </div>
          <div>
            <Tooltip content="Удалить" color="danger" onClick={() => {}}>
              <DeleteButton
                productId={product.id}
                websocketRef={websocketRef}
              />
            </Tooltip>
          </div>
        </div>
      );
    default:
      return null;
  }
};
