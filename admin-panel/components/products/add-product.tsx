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
import { fetchBrands, fetchCategories } from "@/utils/fetching";
import { Category, Brand } from "@/types";
import { Icon } from "@iconify/react";

interface AutoPartInfo {
  title: string;
  description: string;
}

export const AddProduct: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [name, setName] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [brand, setBrand] = useState<Brand | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stock, setStock] = useState<string>("");
  const [autoPartInfo, setAutoPartInfo] = useState<AutoPartInfo[]>([
    { title: "", description: "" },
  ]);
  const { data: session } = useSession();

  const [inputYear, setYearValue] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [showEnter, setShowEnter] = useState<boolean>(false);
  const [yearError, setYearError] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);

      const brandsData = await fetchBrands();
      setBrands(brandsData);
    };

    fetchInitialData();
  }, []);

  const handleAutoPartInfoChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newAutoPartInfo = [...autoPartInfo];
    newAutoPartInfo[index][field] = value;
    setAutoPartInfo(newAutoPartInfo);
  };

  const addAutoPartInfo = () => {
    setAutoPartInfo([...autoPartInfo, { title: "", description: "" }]);
  };

  const handleSubmit = async () => {
    if (!brand || selectedCategories.length === 0) {
      alert("Please select a brand and at least one category.");
      return;
    }

    const data = {
      name,
      model_name: modelName,
      price: parseFloat(price),
      category_id: selectedCategories.map((category) => category.id),
      brand_id: brand.id,
      stock: parseInt(stock, 10),
      auto_part_info: autoPartInfo,
      img: "https://example.com/images/brake_pad.jpg", // Замените на реальную ссылку на изображение
    };

    console.log("Submitting data:", data);

    try {
      const response = await fetch("http://localhost:4000/admin/part/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Data submitted:", data);
      onClose();
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategories([...selectedCategories, category]);
  };

  const handleDeleteCategory = (categoryToDelete: Category) => {
    setSelectedCategories(
      selectedCategories.filter(
        (category) => category.id !== categoryToDelete.id
      )
    );
  };

  const handleBrandChange = (brand: Brand) => {
    setBrand(brand);
  };

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
        !tags.includes(year)
      ) {
        setTags([...tags, year]);
        setYearError("");
        setYearValue("");
        setShowEnter(false);
      } else {
        setYearError("Год введен неправильно");
      }
    }
  };

  const handleDeleteTag = (tagToDelete: number) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Добавить продукт
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Новый продукт
          </ModalHeader>
          <ModalBody>
            <label>Название</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="bordered"
            />
            <label>Модель</label>
            <Input
              defaultValue={modelName}
              name="model_name"
              onChange={(e) => setModelName(e.target.value)}
              variant="bordered"
            />
            <label>Цена</label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="bordered"
            />

            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  {brand ? brand.name : "Выберите бренд"}
                </Button>
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

            <label>Категории</label>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Добавить категорию</Button>
              </DropdownTrigger>
              <DropdownMenu>
                {categories.map((category) => (
                  <DropdownItem
                    key={category.id}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="mt-4 gap-2 flex">
              {selectedCategories.map((category) => (
                <Chip
                  key={category.id}
                  onClose={() => handleDeleteCategory(category)}
                  variant="shadow"
                >
                  {category.name}
                </Chip>
              ))}
            </div>

            <label>Наличие</label>
            <Input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              variant="bordered"
            />
            <label>Информация о запчастях</label>
            {autoPartInfo.map((info, index) => (
              <div key={index}>
                <Input
                  value={info.title}
                  onChange={(e) =>
                    handleAutoPartInfoChange(index, "title", e.target.value)
                  }
                  placeholder="Title"
                  variant="bordered"
                />
                <Input
                  value={info.description}
                  onChange={(e) =>
                    handleAutoPartInfoChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Description"
                  variant="bordered"
                />
              </div>
            ))}
            <Button
              onPress={addAutoPartInfo}
              color="primary"
              variant="bordered"
            >
              Еще
            </Button>
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
              {yearError != "" && <p className=" text-red-600">{yearError}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Отмена</Button>
            <Button onPress={handleSubmit}>Добавить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
