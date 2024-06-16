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
import { EditIcon } from "../icons/table/edit-icon";
import { Brand, Category, Product } from "@/types";
import { useSession } from "next-auth/react";
import { useEditStore } from "@/store/editStore";
import { fetchBrands, fetchCategories } from "@/utils/fetching";

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
    selectedCategory,
    selectedBrand,
    setSelectedCategory,
    setSelectedBrand,
  } = useEditStore();

  const [editedProduct, setEditedProduct] = useState({
    id: selectedProductId,
    category_id: product.category_id,
    brand_id: product.brand_id,
    name: product.name,
    model_name: product.model_name,
    price: product.price,
    stock: product.stock,
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

  const handleCategoryChange = (category: Category) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      category_id: category.id,
    }));
    setSelectedCategory(category);
  };

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
              defaultValue={String(product.stock)}
              onChange={handleChange}
            />
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
