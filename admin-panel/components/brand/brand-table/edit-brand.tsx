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

interface EditBrandsProps {
  selectedModelId: number;
  brand: Brand;
}

export const EditBrand: React.FC<EditBrandsProps> = ({
  selectedModelId,
  brand,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [inputYear, setYearValue] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [showEnter, setShowEnter] = useState<boolean>(false);
  const [yearError, setYearError] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYearValue(event.target.value);
    setShowEnter(event.target.value !== "");
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const year = parseInt(inputYear.trim());
      const currentYear = new Date().getFullYear();

      if (
        !isNaN(year) &&
        year.toString().length === 4 &&
        year <= currentYear &&
        year >= 1900 &&
        !tags.includes(year)
      ) {
        setTags([...tags, year]);
        setYearError("");
        setYearValue("");
        setShowEnter(false);
      } else {
        setYearError("Год указан неправильно");
      }
    }
  };

  const handleDeleteTag = (tagToDelete: number) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
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
            <Input label="Имя модели" />
            <Input label="Изображение" />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={onClose}>
              Закрыть
            </Button>
            <Button onClick={() => {}}>Сохранить модель</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
