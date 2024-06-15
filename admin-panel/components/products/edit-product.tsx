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
import React, { useState } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import { products } from "../../store/data";
import { format, parse } from "date-fns";

interface EditProductsProps {
  selectedProductsId: string;
  products: (typeof products)[number];
}

export const EditProducts: React.FC<EditProductsProps> = ({
  selectedProductsId,
  products,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);

  const [editedData, setEditedData] = useState({
    id: selectedProductsId,
    fio: products.fio,
    phoneNumber: products.phoneNumber,
    email: products.email,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIsPaidChange = (value: string) => {
    setEditedData((prevData) => ({
      ...prevData,
      isPaid: value,
    }));
  };

  // Обработчик изменения статуса
  const handleStatusChange = (value: string) => {
    setEditedData((prevData) => ({
      ...prevData,
      status: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      // Парсим дату из формата DD.MM.YYYY в объект Date
      const parsedDate = parse(value, "dd.MM.yyyy", new Date());
      // Форматируем дату в ISO формат
      const isoDate = format(parsedDate, "yyyy-MM-dd'T'00:00:00'Z'");
      setEditedData((prevData) => ({
        ...prevData,
        [name]: isoDate,
      }));
    } catch (error) {
      console.error("Ошибка при преобразовании даты:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      console.log("Sending data to server:", JSON.stringify(editedData)); // Добавлено логирование данных
      await fetch(
        `https://api-deplom.onrender.com/api/product/${editedData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData),
        }
      );
    } catch (error) {
      console.error("Произошла ошибка при обновлении данных:", error);
    }
  };

  const handleSaveChanges = () => {
    handleUpdateData();
    onClose();
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
                    label="ФИО"
                    variant="bordered"
                    name="fio"
                    defaultValue={products.fio}
                    onChange={handleChange}
                  />
                  <Input
                    label="Номер телефона"
                    variant="bordered"
                    name="phoneNumber"
                    defaultValue={products.phoneNumber}
                    onChange={handleChange}
                  />
                  <Input
                    label="Почта"
                    variant="bordered"
                    name="email"
                    defaultValue={products.email}
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
