"use client";
import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { Category, ModelAuto, Product } from "@/types";
import { Span } from "next/dist/trace";
import { useSession } from "next-auth/react";
import { deleteProduct } from "@/utils/fetching";
import DeleteButton from "./delete-button";
import { EditModel } from "./edit-model";
import DeleteModelButton from "./delete-button";
import { appendFile } from "fs";
import { release } from "os";

interface Props {
  model: ModelAuto;
  columnKey: string | React.Key;
  onEdit: (model: any) => void;
}

export const RenderCell: React.FC<Props> = ({
  model,
  columnKey,
  onEdit,
}: Props) => {
  console.log(model.release_year);
  // @ts-ignore
  const cellValue = model[columnKey];
  switch (columnKey) {
    case "id":
      return <span>{cellValue}</span>;
    case "name":
      const concatenatedName = `${model.brand_name} ${model.name}`;
      return <span>{concatenatedName}</span>;
    case "img_url":
      return <img src={cellValue} alt="" width={100} height={100} />;
    case "brand_name":
      return <span>{cellValue}</span>;
    case "release_year":
      return (
        <div className="flex flex-wrap gap-2">
          {model.release_year.map((year: number) => (
            <Chip size="sm" variant="shadow" color="primary" key={year}>
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
              <button onClick={() => console.log("View user", model.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <EditModel model={model} selectedModelId={model.id} />
          </div>
          <div>
            <Tooltip
              content="Удалить"
              color="danger"
              onClick={() => console.log("Delete user", model.id)}
            >
              <DeleteModelButton modelId={model.id} />
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
