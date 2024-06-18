"use client";
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
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { Brand, Category, ModelAuto } from "@/types";
import { useSession } from "next-auth/react";
import { useEditStore } from "@/store/editStore";
import { fetchBrands, fetchCategories } from "@/utils/fetching";

interface EditModelsProps {
  selectedModelId: number;
  model: ModelAuto;
}

export const EditModel: React.FC<EditModelsProps> = ({
  selectedModelId,
  model,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: session } = useSession();
  const [brands, setBrands] = useState<Brand[]>([]);
  const {
    selectedCategory,
    selectedBrand,
    setSelectedCategory,
    setSelectedBrand,
  } = useEditStore();

  const [editedModel, setEditedModel] = useState({
    id: selectedModelId,
    brand_id: model.brand,
    name: model.name,
  });

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
            Редактировать Заявка
          </ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={onClose}>
              Закрыть
            </Button>
            <Button onClick={() => {}}>Сохранить заявку</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
