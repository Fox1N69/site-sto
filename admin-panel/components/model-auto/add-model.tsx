"use client";
import React, { useEffect, useState } from "react";
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
  Chip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import {
  fetchBrands,
  fetchCategories,
  useAddModel,
  useFetchModel,
} from "@/utils/fetching";
import { Category, Brand } from "@/types";
import { ModelAuto } from ".";
import { useModelStore } from "@/store/modelStroe";

export const AddModel: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: session } = useSession();
  const token = session?.user.token;
  const {
    name,
    setName,
    img_url,
    setImgUrl,
    brand_id,
    setBrandId,
    release_year,
    setReleaseYear,
  } = useModelStore((state) => state);
  const { addModel, success, error, loading } = useAddModel();
  const handleAddModel = async () => {
    const data = {
      name,
      img_url: img_url,
      brand_id: brand_id,
      release_year: release_year,
    };
    await addModel(token, data);
    onClose();
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Добавить модель
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Новая модель
          </ModalHeader>
          <ModalBody>
            <Input
              label="Название модели"
              type="text"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Ссылка на изображение"
              type="text"
              variant="bordered"
              value={img_url}
              onChange={(e) => setImgUrl(e.target.value)}
            />
            <Input
              label="бренд"
              type="text"
              variant="bordered"
              value={brand_id.toString()}
              onChange={(e) => setBrandId(Number(e.target.value))}
            />
            <Input
              label="Год выпуска"
              type="text"
              variant="bordered"
              value={release_year.toString()}
              onChange={(e) => setReleaseYear(Number(e.target.value))}
            />
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Отмена</Button>
            <Button onPress={handleAddModel}>Добавить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
