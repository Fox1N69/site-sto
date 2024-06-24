import React from "react";
import { Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { deleteProduct, deleteBrand, deleteModel } from "@/utils/fetching";
import { useSession } from "next-auth/react";

interface DeleteButtonProps {
  brandID: number;
}

const DeleteModelButton: React.FC<DeleteButtonProps> = ({ brandID }) => {
  const { data: session } = useSession();
  const token = session?.user.token;
  const handleDelete = async () => {
    await deleteBrand(token, brandID);
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
