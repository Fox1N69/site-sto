import { ModelAuto } from "@/types";
import axios from "axios";
import { METHODS } from "http";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:4000/shop/categorys");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchBrands = async () => {
  try {
    const response = await fetch("http://localhost:4000/shop/brands");
    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const deleteProduct = async (
  token: string | undefined,
  productId: number
) => {
  try {
    const response = await fetch(
      `http://localhost:4000/admin/part/delete/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    // Обработка ошибок
  }
};

export const useFetchModelAuto = (token: { token: string }) => {
  const [modelAuto, setModelAtuo] = useState<ModelAuto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ModelAuto[]>(
          `http://localhost:4000/admin/model-auto/create`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setModelAtuo(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return modelAuto;
};
