import { Body } from "./../components/sidebar/sidebar.styles";
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

export const useFetchModel = () => {
  const [model, setModel] = useState<ModelAuto[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ModelAuto[]>(
          "http://localhost:4000/shop/modelautos"
        );
        setModel(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return model;
};

export const useAddModel = () => {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const addModel = async (
    token: string | undefined,
    data: {
      name: string;
      img_url: string;
      brand_id: number;
      release_year: number;
    }
  ) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/admin/model-auto/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError("error create model auto");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { addModel, success, error, loading };
};
