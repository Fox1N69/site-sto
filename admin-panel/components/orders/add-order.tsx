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
            <Button onPress={() => {}}>Добавить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
