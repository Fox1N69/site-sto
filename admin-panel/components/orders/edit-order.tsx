import React, { useState, useEffect } from "react";
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
import { EditIcon } from "../icons/table/edit-icon";
import { orders } from "../table/data";
import { format, parse } from "date-fns";

interface EditOrderProps {
  selectedOrderId: string;
  order: (typeof orders)[number];
  onUpdateOrder: (updatedOrder: (typeof orders)[number]) => void;
}

export const EditOrders: React.FC<EditOrderProps> = ({
  selectedOrderId,
  order,
  onUpdateOrder,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);

  const [editedData, setEditedData] = useState({
    id: selectedOrderId,
    fio: order.fio,
    branch: order.branch,
    storageCell: order.storageCell,
    diskSize: order.diskSize,
    arrivalDate: order.arrivalDate,
    deliveryDate: order.deliveryDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    price: order.price,
    isPaid: order.isPaid,
    status: order.status,
    avatar: order.avatar,
  });

  useEffect(() => {
    setEditedData({
      id: selectedOrderId,
      fio: order.fio,
      branch: order.branch,
      storageCell: order.storageCell,
      diskSize: order.diskSize,
      arrivalDate: order.arrivalDate,
      deliveryDate: order.deliveryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      price: order.price,
      isPaid: order.isPaid,
      status: order.status,
      avatar: order.avatar,
    });
  }, [order]);

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

  const handleStatusChange = (value: string) => {
    setEditedData((prevData) => ({
      ...prevData,
      status: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      const parsedDate = parse(value, "dd.MM.yyyy", new Date());
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
      console.log("Sending data to server:", JSON.stringify(editedData));
      const response = await fetch(
        `https://api-deplom.onrender.com/api/crequest/${editedData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData),
        }
      );
      if (response.ok) {
        onUpdateOrder(editedData);
      }
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
                    defaultValue={order.fio}
                    onChange={handleChange}
                  />
                  <Input
                    label="Ячейка хранения"
                    variant="bordered"
                    name="storageCell"
                    value={editedData.storageCell}
                    onChange={handleChange}
                  />
                  <Input
                    label="Радиус диска"
                    variant="bordered"
                    name="diskSize"
                    defaultValue={order.diskSize}
                    onChange={handleChange}
                  />
                  <Input
                    label="Дата поступления"
                    variant="bordered"
                    name="arrivalDate"
                    defaultValue={format(
                      parse(
                        order.arrivalDate,
                        "yyyy-MM-dd'T'HH:mm:ss'Z'",
                        new Date()
                      ),
                      "dd.MM.yyyy"
                    )}
                    onChange={handleDateChange}
                  />
                  <Input
                    label="Дата сдачи"
                    variant="bordered"
                    name="deliveryDate"
                    defaultValue={format(
                      parse(
                        order.deliveryDate,
                        "yyyy-MM-dd'T'HH:mm:ss'Z'",
                        new Date()
                      ),
                      "dd.MM.yyyy"
                    )}
                    onChange={handleDateChange}
                  />
                  <Input
                    label="Цена хранения"
                    variant="bordered"
                    name="price"
                    defaultValue={order.price}
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
