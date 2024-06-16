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
import { EditIcon } from "../icons/table/edit-icon";
import { format, parse } from "date-fns";
import { Brand, Category, Product } from "@/types";
import { Cookie } from "next/font/google";
import { useSession } from "next-auth/react";
import { useEditStore } from "@/store/editStore";

interface EditProductsProps {
  selectedProductsId: number;
  products: Product;
}

export const EditProducts: React.FC<EditProductsProps> = ({
  selectedProductsId,
  products,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const {
    selectedCategory,
    selectedBrand,
    setSelectedCategory,
    setSelectedBrand,
  } = useEditStore();

  const handleBrandChange = (brand: Brand) => {
    setEditedData((prevData) => ({
      ...prevData,
      brand_id: brand.id,
    }));
    setSelectedBrand(brand);
  };

  const [editedData, setEditedData] = useState({
    id: selectedProductsId,
    category_id: products.category_id,
  });

  useEffect(() => {
    if (products.Category) {
      setSelectedCategory(products.Category);
    }
  }, [products.Category, setSelectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/shop/categorys");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateData = async () => {
    try {
      console.log("Sending data to server:", JSON.stringify(editedData));
      await fetch(`http://localhost:4000/admin/part/update/${editedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(editedData),
      });
      console.log(JSON.stringify(editedData));
    } catch (error) {
      console.error("Произошла ошибка при обновлении данных:", error);
    }
  };

  const handleSaveChanges = () => {
    handleUpdateData();
    onClose();
  };

  const handleCategoryChange = (category: Category) => {
    setEditedData((prevData) => ({
      ...prevData,
      category_id: category.id,
    }));
    setSelectedCategory(category);
  };

  return (
    <div>
      <>
        <Tooltip content="Edit" color="secondary">
          <button onClick={onOpen}>
            <EditIcon size={20} fill="#979797" />
          </button>
        </Tooltip>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Редактировать Заявка
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Название"
                    variant="bordered"
                    name="name"
                    defaultValue={products.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Модель"
                    variant="bordered"
                    name="model_name"
                    defaultValue={products.model_name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Price"
                    variant="bordered"
                    name="price"
                    defaultValue={products.price.toString()}
                    onChange={handleChange}
                  />
                  <Input
                    label="Бренд"
                    variant="bordered"
                    name="brand_name"
                    defaultValue={products.Brand?.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Категория"
                    variant="bordered"
                    name="category_name"
                    defaultValue={products.Category?.name}
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

                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">
                        {selectedCategory
                          ? selectedCategory.name
                          : "Выберите категорию"}
                      </Button>
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
                  <Input
                    label="Наличие"
                    variant="bordered"
                    name="stock"
                    defaultValue={products.stock.toString()}
                    onChange={handleChange}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Закрыть
                  </Button>
                  <Button color="primary" onClick={handleSaveChanges}>
                    Сохранить заявку
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
