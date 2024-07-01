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
import { ModelAutos } from ".";
import { useModelStore } from "@/store/modelStroe";
import { event } from "@tauri-apps/api";
import { appendFile } from "fs";
import { Icon } from "@iconify/react";

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
  const [showEnter, setShowEnter] = useState<boolean>(false);
  const [yearError, setYearError] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);

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

  const handleAddModel = async () => {
    if (!brand) {
      alert("Выберити бренд машины");
      return;
    }

    const data = {
      name,
      img_url: img_url,
      brand_id: brand.id,
      release_year: tags,
    };
    await addModel(token, data);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setImgUrl("");
      setBrandId(0);
      setReleaseYear(0);
      setTags([]);
      setYearValue("");
      setYearError("");
      setShowEnter(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchBrandData = async () => {
      const brandData = await fetchBrands();
      setBrands(brandData);
    };

    fetchBrandData();
  }, []);

  const handleBrandChange = (brand: Brand) => {
    setBrandId(brand.id);
    setBrand(brand);
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
            <Dropdown>
              <DropdownTrigger>
                <Button>{brand ? brand.name : "Выберите бренд"}</Button>
              </DropdownTrigger>
              <DropdownMenu>
                {brands.map((brand) => (
                  <DropdownItem
                    key={brand.id}
                    onClick={() => handleBrandChange(brand)}
                  >
                    {brand.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Input
              label="Года выпуска"
              variant="bordered"
              value={inputYear}
              onKeyPress={handleInputKeyPress}
              onChange={handleInputChange}
              endContent={
                showEnter && (
                  <div className="flex items-center my-[6px]">
                    Enter <Icon icon={"uil:enter"} />
                  </div>
                )
              }
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
              {yearError != "" && <p className="text-red-600">{yearError}</p>}
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
