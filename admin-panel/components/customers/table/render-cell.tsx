import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { clients } from "../../table/data";
import { EditClients } from "../edit-customer";
import { Retryer } from "react-query/types/core/retryer";
import { format } from "date-fns";

interface Props {
  client: (typeof clients)[number];
  columnKey: string | React.Key;
  onEdit: (client: any) => void;
}

export const RenderCell = ({ client, columnKey, onEdit }: Props) => {
  const handleDelete = () => {
    fetch(`https://api-deplom.onrender.com/api/client/${client.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete client");
        }
      })
      .catch((error) => {
        // Обработка ошибок
      });
  };

  // @ts-ignore
  const cellValue = client[columnKey];
  switch (columnKey) {
    case "name":
      return <User avatarProps={{}} name={cellValue}></User>;
    case "phone_number":
      return <span>{cellValue}</span>;
    case "email":
      return <span>{cellValue}</span>;
    case "lastVisit":
      return <span>{cellValue}</span>;

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Подробнее">
              <button onClick={() => console.log("View user", client.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <EditClients clients={client} selectedClientsId={client.id} />
          </div>
          <div>
            <Tooltip
              content="Удалить"
              color="danger"
              onClick={() => console.log("Delete user", client.id)}
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
