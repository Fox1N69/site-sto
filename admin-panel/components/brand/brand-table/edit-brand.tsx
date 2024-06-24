"use client";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { Brand, ModelAuto } from "@/types";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import { useUpdateBrand } from "@/utils/fetching";

interface EditBrandsProps {
  selectedBrandlID: number;
  brand: Brand;
}

export const EditBrand: React.FC<EditBrandsProps> = ({
  selectedBrandlID,
  brand,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [name, setName] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const token = session?.user.token;

  const handleUpdateBrand = async () => {
    const data = {
      name,
      image_url: imgUrl,
    };
    await useUpdateBrand(token, selectedBrandlID, data);
    onClose();
  };

  return (
    <div>
      <Tooltip content="Edit">
        <button onClick={onOpen}>
          <EditIcon size={20} fill="#979797" />
        </button>
      </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Редактировать модель
          </ModalHeader>
          <ModalBody>
            <Input
              label="Название бренда"
              name="brand"
              type="text"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Изображение"
              name="image_url"
              type="text"
              defaultValue={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={onClose}>
              Закрыть
            </Button>
            <Button onClick={handleUpdateBrand}>Сохранить модель</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
