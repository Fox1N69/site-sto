"use client";
import {
  Button,
  Chip,
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
import React, { ChangeEvent, useEffect, useState } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import { Brand, Category, Product } from "@/types";
import { useSession } from "next-auth/react";
import { useEditStore } from "@/store/editStore";
import { fetchBrands, fetchCategories } from "@/utils/fetching";
import { Icon } from "@iconify/react";

interface EditProductsProps {
  selectedProductId: number;
  product: Product;
}

export const EditProduct: React.FC<EditProductsProps> = ({
  selectedProductId,
  product,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: session } = useSession();
  const [brands, setBrands] = useState<Brand[]>([]);
  const {
    selectedCategories,
    selectedBrand,
    toggleSelectedCategory,
    setSelectedBrand,
  } = useEditStore();

  const [inputYear, setYearValue] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [showEnter, setShowEnter] = useState<boolean>(false);
  const [yearError, setYearError] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYearValue(event.target.value);
    setShowEnter(event.target.value !== "");
  };

  useEffect(() => {
    if (isOpen && product.for_years) {
      setTags([...product.for_years]);
    }
  }, [isOpen, product]);

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

  const [editedProduct, setEditedProduct] = useState({
    id: selectedProductId,
    category_id: product.category_id,
    brand_id: product.brand_id,
    name: product.name,
    model_name: product.model_name,
    price: product.price,
    stock: product.stock,
    for_years: product.for_years,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);

      const brandsData = await fetchBrands();
      setBrands(brandsData);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      for_years: tags,
      category_id: selectedCategories.map((category) => category.id),
    }));
  }, [tags, selectedCategories]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      await fetch(
        `http://localhost:4000/admin/part/update/${editedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify(editedProduct),
        }
      );
    } catch (error) {
      console.error("Произошла ошибка при обновлении данных:", error);
    }
  };

  const handleSaveChanges = () => {
    handleUpdateProduct();
    onClose();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);

      const brandsData = await fetchBrands();
      setBrands(brandsData);
    };

    fetchInitialData();
  }, []);

  const renderCategoryDropdown = () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">
          {selectedCategories.length > 0
            ? `Категории: ${selectedCategories.map((c) => c.name).join(", ")}`
            : "Выберите категории"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {categories.map((category) => (
          <DropdownItem
            key={category.id}
            color={
              selectedCategories.find((c) => c.id === category.id)
                ? "danger"
                : "success"
            }
            onClick={() => toggleSelectedCategory(category)}
          >
            {category.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  const handleBrandChange = (brand: Brand) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      brand_id: brand.id,
    }));
    setSelectedBrand(brand);
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
            Редактировать Заявка
          </ModalHeader>
          <ModalBody>
            <Input
              label="Название"
              variant="bordered"
              name="name"
              defaultValue={product.name}
              onChange={handleChange}
            />
            <Input
              label="Модель"
              variant="bordered"
              name="model_name"
              defaultValue={product.model_name}
              onChange={handleChange}
            />
            <Input
              label="Цена"
              variant="bordered"
              name="price"
              defaultValue={String(product.price)}
              onChange={handleChange}
            />
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  {selectedBrand ? selectedBrand.name : "Выберите бренд"}
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

            {renderCategoryDropdown()}

            <Input
              label="Наличие"
              variant="bordered"
              name="stock"
              defaultValue={String(product.stock)}
              onChange={handleChange}
            />
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
                  variant="bordered"
                  color="primary"
                  onClose={() => handleDeleteTag(tag)}
                >
                  {tag.toString()}
                </Chip>
              ))}
              {yearError !== "" && <p className="text-red-600">{yearError}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={onClose}>
              Закрыть
            </Button>
            <Button onClick={handleSaveChanges}>Сохранить заявку</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
