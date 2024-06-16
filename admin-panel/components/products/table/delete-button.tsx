import React from "react";
import { Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { deleteProduct } from "@/utils/fetching";
import { useSession } from "next-auth/react";

interface DeleteButtonProps {
  productId: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ productId }) => {
  const { data: session } = useSession();
  const token = session?.user.token;
  const handleDelete = async () => {
    await deleteProduct(token, productId);
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
