"use client";
import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../../../icons/table/delete-icon";
import { EyeIcon } from "../../../icons/table/eye-icon";
import { Brand, Category, ModelAuto, Product } from "@/types";
import { Span } from "next/dist/trace";
import { useSession } from "next-auth/react";
import { deleteProduct, updateModelReleaseYear } from "@/utils/fetching";
import DeleteButton from "./delete-button";
import { EditCategory } from "./edit-category";
import DeleteModelButton from "./delete-button";
import { appendFile } from "fs";
import { release } from "os";
import Cookies from "js-cookie";

interface Props {
  category: Category;
  columnKey: string | React.Key;
  onEdit: (brand: any) => void;
}

export const RenderCellBrand: React.FC<Props> = ({
  category,
  columnKey,
  onEdit,
}: Props) => {
  // @ts-ignore
  const cellValue = category[columnKey];
  switch (columnKey) {
    case "id":
      return <span>{cellValue}</span>;
    case "image_url":
      return (
        <div>
          <img className="ml-4" src={cellValue} alt="" width={50} height={50} />
        </div>
      );

    case "name":
      return <span>{cellValue}</span>;
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Подробнее">
              <button onClick={() => console.log("View user", category.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <EditCategory
              category={category}
              selectedCategoryID={category.id}
            />
          </div>
          <div>
            <Tooltip
              content="Удалить"
              color="danger"
              onClick={() => console.log("Delete user", category.id)}
            >
              <DeleteModelButton brandID={category.id} />
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
