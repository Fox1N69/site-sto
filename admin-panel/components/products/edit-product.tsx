import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import { format, parse } from "date-fns";
import { Product } from "@/types";
import { Cookie } from "next/font/google";
import { useSession } from "next-auth/react";

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

  const [editedData, setEditedData] = useState({
    id: selectedProductsId,
  });

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

  const handleCategoryChange = (value: string) => {
    setEditedData((prevData) => ({
      ...prevData,
      category_name: value,
    }));
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
                  <Input
                    label="Наличие"
                    variant="bordered"
                    name="stock"
                    defaultValue={products.stock.toString()}
                    onChange={handleChange}
                  />

                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">
                        {editedData.isPaid || "Оплата"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Static Actions"
                      onSelect={(event) => {
                        const value = (
                          event.target as HTMLElement
                        ).getAttribute("data-value");
                        if (value) {
                          handleIsPaidChange(value);
                        }
                      }}
                    >
                      <DropdownItem
                        key="Paid"
                        color="success"
                        onClick={() => handleIsPaidChange("оплачено")}
                      >
                        Оплачено
                      </DropdownItem>
                      <DropdownItem
                        key="noPaid"
                        color="danger"
                        onClick={() => handleIsPaidChange("не оплачено")}
                      >
                        Не Оплачено
                      </DropdownItem>
                      <DropdownItem
                        key="PaidForGive"
                        color="warning"
                        onClick={() =>
                          handleIsPaidChange("Оплата при получение")
                        }
                      >
                        Оплата при получение
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">
                        {" "}
                        {editedData.status || "Статус"}{" "}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      onSelect={(event) => {
                        const value = (
                          event.target as HTMLElement
                        ).getAttribute("data-value");
                        if (value) {
                          handleStatusChange(value);
                        }
                      }}
                    >
                      <DropdownItem
                        onClick={() => handleStatusChange("На Хранении")}
                        color="success"
                      >
                        На Хранение
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleStatusChange("Получен")}
                        color="danger"
                      >
                        Получен
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleStatusChange("Ожидает Получения")}
                        color="warning"
                      >
                        Ожидает Получения
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
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
