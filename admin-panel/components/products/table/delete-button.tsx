import React from "react";
import { Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../icons/table/delete-icon";

interface DeleteButtonProps {
  productId: number;
  websocketRef?: React.MutableRefObject<WebSocket | null>;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  productId,
  websocketRef,
}) => {
  const handleDelete = () => {
    if (websocketRef?.current) {
      const message = {
        type: "deleteAutoPart",
        autoPartID: productId.toString(),
      };
      websocketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket connection is not available");
    }
  };

  return (
    <Tooltip content="Удалить" color="danger">
      <button onClick={handleDelete}>
        <DeleteIcon size={20} fill="#FF0080" />
      </button>
    </Tooltip>
  );
};

export default DeleteButton;
