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
import { useBranch } from "../context/BranchContext";
import { useAddBrand } from "@/utils/fetching";
import { useSession } from "next-auth/react";

export const AddBrands = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [name, setName] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const { addBrand } = useAddBrand();
  const { data: session } = useSession();
  const token = session?.user.token;

  const handleAddBrand = async () => {
    const data = {
      name,
      image_url: imgUrl,
    };
    await addBrand(token, data);
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
            <Button onPress={handleAddBrand}>Добавить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
