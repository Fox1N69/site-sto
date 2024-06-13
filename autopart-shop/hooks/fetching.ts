import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Типы
import { AutoPart, Product } from "@/types";

// Хук для получения автозапчастей
export const useFetchAutoParts = () => {
  const [autoParts, setAutoParts] = useState<AutoPart[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AutoPart[]>(
          "http://localhost:4000/shop/autoparts"
        );
        setAutoParts(response.data);
      } catch (error) {
        console.error("Error fetching auto parts data:", error);
      }
    };

    fetchData();
  }, []);

  return autoParts;
};

// Хук для получения товаров из корзины
export const useFetchCartItems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = session?.user.id;
        if (!userId) return;

        const response = await fetch(
          `http://localhost:4000/v1/account/user/${userId}/basket`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const extractedProducts: Product[] = data.BasketItems.map(
          (item: any) => ({
            id: item.AutoPart.id,
            name: item.AutoPart.name,
            href: "#",
            color: item.AutoPart.model_name,
            price: item.AutoPart.price.toString(),
            quantity: item.quantity,
            imageSrc: item.AutoPart.img,
            imageAlt: item.AutoPart.name,
          })
        );

        setProducts(extractedProducts);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      }
    };

    if (session) {
      fetchCartItems();
    }
  }, [session]);

  return products;
};
