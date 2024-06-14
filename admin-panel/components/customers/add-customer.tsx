import React, { useState } from "react";
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

export const AddClient = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [fio, setFio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [lastVisit, setLastVisit] = useState("");

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
      fio: fio,
      phoneNumber: phoneNumber,
      email: email,
      lastVisit: lastVisit,
    };

    try {
      const response = await fetch(
        "https://api-deplom.onrender.com/api/client/set",
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
            <label>Номер телефона</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              label="79009009090"
              variant="bordered"
            />
            <label>Почта клиента</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="e-mail"
              variant="bordered"
            />
            <label>Последний визит</label>
            <Input
              value={lastVisit}
              onChange={(e) => setLastVisit(e.target.value)}
              label="01.01.2001"
              variant="bordered"
            />
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
