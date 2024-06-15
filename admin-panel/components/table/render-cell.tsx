import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { orders } from "../../store/data";
import { EditOrders } from "../orders/edit-order";
import { format, isSameDay } from "date-fns";

interface Props {
  order: (typeof orders)[number];
  columnKey: string | React.Key;
  onEdit: (order: any) => void;
}

export const RenderCell = ({ order, columnKey, onEdit }: Props) => {
  const handleDelete = () => {
    fetch(`https://api-deplom.onrender.com/api/crequest/${order.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete order");
        }
      })
      .catch((error) => {
        // Обработка ошибок
      });
  };

  // @ts-ignore
  const cellValue = order[columnKey];
  switch (columnKey) {
    case "name":
      return <User avatarProps={{}} name={cellValue}></User>;
    case "role":
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span></span>
          </div>
        </div>
      );
    case "branch":
      return <span>{cellValue}</span>;
    case "storageCell":
      return <span>{cellValue}</span>;
    case "diskSize":
      return <span>{cellValue}</span>;
    case "arrivalDate":
      return <span>{format(new Date(cellValue), "dd.MM.yyyy")}</span>;
    case "deliveryDate":
      return <span>{format(new Date(cellValue), "dd.MM.yyyy")}</span>;
    case "isPaid":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={
            cellValue === "оплачено"
              ? "success"
              : cellValue === "не оплачено"
              ? "warning"
              : "danger"
          }
        >
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      );
    case "status":
      const deliveryDate = new Date(order.deliveryDate);
      const currentDate = new Date();
      const isSameDayDelivery = isSameDay(deliveryDate, currentDate);
      const statusText = isSameDayDelivery ? "Ожидает Получения" : cellValue;
      const statusColor = isSameDayDelivery
        ? "danger"
        : cellValue === "На Хранении"
        ? "success"
        : cellValue === "Ожидает Получения"
        ? "warning"
        : "danger";
      return (
        <Chip size="sm" variant="flat" color={statusColor}>
          <span className="capitalize text-xs">{statusText}</span>
        </Chip>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Подробнее">
              <button onClick={() => console.log("View user", order.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <EditOrders
              selectedOrderId={order.id}
              order={order}
              onUpdateOrder={onEdit}
            />
          </div>
          <div>
            <Tooltip
              content="Удалить"
              color="danger"
              onClick={() => console.log("Delete user", order.id)}
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
