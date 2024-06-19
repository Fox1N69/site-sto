"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
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
import { event } from "@tauri-apps/api";

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
  const [inputYear, setYearValue] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYearValue(event.target.value);
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const year = parseInt(inputYear.trim());
      if (!isNaN(year) && !tags.includes(year)) {
        setTags([...tags, year]);
        setYearValue("");
      }
    }
  };

  const handleDeleteTag = (tagToDelete: number) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleAddModel = async () => {
    const data = {
      name,
      img_url: img_url,
      brand_id: brand_id,
      release_year: tags,
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
              label="Модель"
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
              label="Года выпуска"
              variant="bordered"
              value={inputYear}
              onKeyPress={handleInputKeyPress}
              onChange={handleInputChange}
            />
            <div className="flex gap-2 mr-3">
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="shadow"
                  color="primary"
                  onClose={() => handleDeleteTag(tag)}
                >
                  {tag.toString()}
                </Chip>
              ))}
            </div>
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
