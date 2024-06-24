import React from "react";
import { Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { deleteProduct, deleteModel } from "@/utils/fetching";
import { useSession } from "next-auth/react";

interface DeleteButtonProps {
  modelId: number;
}

const DeleteModelButton: React.FC<DeleteButtonProps> = ({ modelId }) => {
  const { data: session } = useSession();
  const token = session?.user.token;
  const handleDelete = async () => {
    await deleteModel(token, modelId);
  };

  return (
    <Tooltip content="Удалить" color="danger">
      <button onClick={handleDelete}>
        <DeleteIcon size={20} fill="#FF0080" />
      </button>
    </Tooltip>
  );
};

export default DeleteModelButton;
