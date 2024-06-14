// store/cartStore.ts
import create from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  itemsInCart: { [key: number]: boolean };
  setItemsInCart: (items: { [key: number]: boolean }) => void;
  addItemToCart: (id: number) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      itemsInCart: {},
      setItemsInCart: (items) =>
        set((state) => ({ itemsInCart: { ...state.itemsInCart, ...items } })),
      addItemToCart: (id) =>
        set((state) => ({ itemsInCart: { ...state.itemsInCart, [id]: true } })),
    }),
    {
      name: "cart-storage", // Название ключа в LocalStorage
    }
  )
);
