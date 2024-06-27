import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useBranch } from "../../context/BranchContext";
import { useSession } from "next-auth/react";
import { updateCategory } from "@/utils/fetching";

export const AddCategories = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [name, setName] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const { data: session } = useSession();
  const token = session?.user.token;

  const handleAddCategory = async () => {
    const data = {
      name,
      image_url: imgUrl,
    };
    onClose();
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Добавить бренд
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Новая Заявка
          </ModalHeader>
          <ModalBody>
            <Input
              defaultValue={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              defaultValue={imgUrl}
              name="image_url"
              onChange={(e) => setImgUrl(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Отмена</Button>
            <Button onPress={handleAddCategory}>Добавить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
