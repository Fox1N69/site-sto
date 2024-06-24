import { Body } from "./../components/sidebar/sidebar.styles";
import { Brand, ModelAuto } from "@/types";
import axios from "axios";
import { METHODS } from "http";
import { useSession } from "next-auth/react";
import { headers } from "next/headers";
import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

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
  }
};

export const deleteModel = async (
  token: string | undefined,
  modelID: number
) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/admin/model-auto/delete/${modelID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.log("Ошибка удаления");
  }
};

export const useFetchModel = () => {
  const [model, setModel] = useState<ModelAuto[]>([]);

  useEffect(() => {
    const client = new W3CWebSocket(
      "ws://localhost:4000/admin/model-auto/ws/all"
    );

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (message) => {
      let data: string | ArrayBuffer | Buffer = message.data;
      if (typeof data !== "string") {
        // Преобразуем данные в строку, если они не являются строкой
        data = Buffer.from(data).toString("utf-8");
      }
      const parsedData = JSON.parse(data);
      setModel(parsedData);
    };

    return () => {
      client.close();
    };
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
      release_year: number[];
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

export const useEditModel = () => {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const editModel = async (
    token: string | undefined,
    modelId: number,
    data: Partial<ModelAuto>
  ) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:4000/admin/model-auto/update/${modelId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError("Ошибка при редактировании модели");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { editModel, success, error, loading };
};

interface ModelAutoUpdateParams {
  id: number;
  releaseYear: number[];
}

export const updateModelReleaseYear = async (
  modelId: number,
  updatedReleaseYears: number[],
  token: string | undefined
): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://localhost:4000/admin/model-auto/update/${modelId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ releaseYear: updatedReleaseYears }),
      }
    );

    if (response.ok) {
      return true;
    } else {
      throw new Error("Failed to update release year");
    }
  } catch (error) {
    console.error("Error updating release year:", error);
    return false;
  }
};

export const deleteBrand = async (
  token: string | undefined,
  brandID: number
) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/admin/brand/delete/${brandID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error, "Error delete brand");
  }
};

export const useAddBrand = () => {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const addBrand = async (
    token: string | undefined,
    data: {
      name: string;
      image_url: string;
    }
  ) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/admin/brand/create", data, {
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

  return { addBrand, success, error, loading };
};

export const updateBrand = async (
  token: string | undefined,
  selectBrandID: number,
  data: { name: string; image_url: string }
) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/admin/brand/update/${selectBrandID}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error, "fatal update brand");
  }
};
