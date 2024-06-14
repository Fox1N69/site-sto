import React, { useContext, useEffect, useState } from "react";
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
} from "@nextui-org/react";
import { useBranch } from "../context/BranchContext";

export const AddOrders = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [fio, setFio] = useState("");
  const [storageCell, setStorageCell] = useState("");
  const [diskSize, setDiskSize] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [price, setPrice] = useState("");
  const [isPaid, setIsPaid] = useState("");
  const [status, setStatus] = useState("");

  const { branch, setBranch } = useBranch();

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(
      today.getMonth() + 1
    ).padStart(2, "0")}.${today.getFullYear()}`;
    setArrivalDate(formattedDate);
  }, []);

  const handleIsPaid = (value: string) => {
    setIsPaid(value);
  };

  const handleStatus = (value: string) => {
    setStatus(value);
  };

  const handleSubmit = async () => {
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split(".").map(Number);
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return date.toISOString();
    };

    const data = {
      fio,
      branch,
      storageCell,
      diskSize,
      arrivalDate: formatDate(arrivalDate),
      deliveryDate: formatDate(deliveryDate),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      price,
      isPaid,
      status: "На Хранении",
    };

    try {
      const response = await fetch(
        "https://api-deplom.onrender.com/api/crequest/set",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle response here
      console.log("Data submitted:", data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Добавить заявку
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Новая Заявка
          </ModalHeader>
          <ModalBody>
            <label>ФИО Клиента</label>
            <Input
              value={fio}
              onChange={(e) => setFio(e.target.value)}
              label="ФИО"
              variant="bordered"
            />
            <label>Филиал</label>
            <Input defaultValue={branch} readOnly />
            <label>Номер ячеки</label>
            <Input
              value={storageCell}
              onChange={(e) => setStorageCell(e.target.value)}
              variant="bordered"
            />
            <label>Радиус шины</label>
            <Input
              value={diskSize}
              onChange={(e) => setDiskSize(e.target.value)}
              variant="bordered"
            />
            <label>Дата хранения</label>
            <Input
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              variant="bordered"
            />
            <label>Дата сдачи</label>
            <Input
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              label="01.01.2001"
              variant="bordered"
            />
            <label>Цена хранения</label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              label="0р"
              variant="bordered"
            />
            <label>Оплата</label>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  {isPaid || "Выберите статус оплаты"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                onSelect={(event) => {
                  const value = (event.target as HTMLElement).getAttribute(
                    "data-value"
                  );
                  if (value) {
                    handleIsPaid(value);
                  }
                }}
              >
                <DropdownItem
                  key="Paid"
                  data-value="оплачено"
                  color="success"
                  onClick={() => handleIsPaid("Оплачено")}
                >
                  Оплачено
                </DropdownItem>
                <DropdownItem
                  key="noPaid"
                  data-value="не оплачено"
                  color="danger"
                  onClick={() => handleIsPaid("не отплачено")}
                >
                  Не оплачено
                </DropdownItem>
                <DropdownItem
                  key="PaidForGive"
                  data-value="оплата при получении"
                  color="warning"
                  onClick={() => handleIsPaid("Оплата при получении")}
                >
                  Оплата при получении
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <label>Статус</label>
            <Input key="Status" value="На Хранении" readOnly />
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
