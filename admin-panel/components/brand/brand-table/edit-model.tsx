"use client";
import {
  Button,
  Chip,
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
import { EditIcon } from "@/components/icons/table/edit-icon";
import { ModelAuto } from "@/types";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";

interface EditModelsProps {
  selectedModelId: number;
  model: ModelAuto;
}

export const EditModel: React.FC<EditModelsProps> = ({
  selectedModelId,
  model,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [inputYear, setYearValue] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [showEnter, setShowEnter] = useState<boolean>(false);
  const [yearError, setYearError] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYearValue(event.target.value);
    setShowEnter(event.target.value !== "");
  };

  useEffect(() => {
    if (isOpen && model.release_year) {
      setTags([...model.release_year]);
    }
  }, [isOpen, model]);

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

  // State для отслеживания изменений в полях редактирования
  const [editedModel, setEditedModel] = useState<ModelAuto>({
    id: selectedModelId,
    name: model.name,
    img_url: model.img_url,
    brand_id: model.brand_id,
    release_year: model.release_year,
  });

  // Функция для обновления модели
  const updateModel = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/admin/model-auto/update/${editedModel.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({
            name: editedModel.name,
            img_url: editedModel.img_url,
            brand_id: editedModel.brand_id,
            release_year: tags,
          }),
        }
      );
      if (response.ok) {
        onClose();
      } else {
        console.error("Failed to update model");
      }
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };

  const handleDeleteTag = (tagToDelete: number) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
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
            Редактировать модель
          </ModalHeader>
          <ModalBody>
            <Input
              label="Имя модели"
              value={editedModel.name}
              onChange={(e) =>
                setEditedModel({ ...editedModel, name: e.target.value })
              }
            />
            <Input
              label="Изображение"
              value={editedModel.img_url}
              onChange={(e) =>
                setEditedModel({ ...editedModel, img_url: e.target.value })
              }
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
                  variant="shadow"
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
            <Button onClick={updateModel}>Сохранить модель</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
