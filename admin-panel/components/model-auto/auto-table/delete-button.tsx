'use client';
import React from "react";
import { Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { useSession } from "next-auth/react";

interface DeleteButtonProps {
  modelId: number;
  websocketRef?: React.MutableRefObject<WebSocket | null>;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  modelId,
  websocketRef,
}) => {
  const { data: session } = useSession();
  const token = session?.user.token;

  const handleDelete = () => {
    if (websocketRef?.current) {
      const message = {
        type: "deleteModel",
        modelID: modelId.toString(),
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
