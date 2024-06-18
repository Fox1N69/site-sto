"use client";
import React, { useEffect, useState } from "react";
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

interface AutoPartInfo {
  title: string;
  description: string;
}

export const AddModel: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: session } = useSession();

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Добавить модель
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Новая модель
          </ModalHeader>
          <ModalBody>
            <Input />
            <Input />
            <Input />
            <Input />
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
