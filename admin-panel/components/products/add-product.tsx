import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

interface AutoPartInfo {
  title: string;
  description: string;
}

export const AddProduct: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [autoPartInfo, setAutoPartInfo] = useState<AutoPartInfo[]>([
    { title: "", description: "" },
  ]);
  const { data: session } = useSession();

  const handleAutoPartInfoChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newAutoPartInfo = [...autoPartInfo];
    newAutoPartInfo[index][field] = value;
    setAutoPartInfo(newAutoPartInfo);
  };

  const addAutoPartInfo = () => {
    setAutoPartInfo([...autoPartInfo, { title: "", description: "" }]);
  };

  const handleSubmit = async () => {
    const data = {
      name: name,
      price: parseFloat(price),
      category_id: parseInt(category, 10),
      brand_id: parseInt(brand, 10),
      stock: parseInt(stock, 10),
      auto_part_info: autoPartInfo,
      img: "https://example.com/images/brake_pad.jpg", // Замените на реальную ссылку на изображение
    };

    try {
      const response = await fetch("http://localhost:4000/admin/part/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Data submitted:", data);
      onClose();
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Добавить продукт
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Новый продукт
          </ModalHeader>
          <ModalBody>
            <label>Название</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="bordered"
            />
            <label>Цена</label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="bordered"
            />
            <label>Бренд</label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              variant="bordered"
            />
            <label>Категория</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="bordered"
            />
            <label>Наличие</label>
            <Input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              variant="bordered"
            />
            <label>Информация о запчастях</label>
            {autoPartInfo.map((info, index) => (
              <div key={index}>
                <Input
                  value={info.title}
                  onChange={(e) =>
                    handleAutoPartInfoChange(index, "title", e.target.value)
                  }
                  placeholder="Title"
                  variant="bordered"
                />
                <Input
                  value={info.description}
                  onChange={(e) =>
                    handleAutoPartInfoChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Description"
                  variant="bordered"
                />
              </div>
            ))}
            <Button onPress={addAutoPartInfo} color="secondary">
              Добавить информацию
            </Button>
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
