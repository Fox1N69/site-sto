// store/cartStore.ts
import { Product } from "@/types";
import create from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  itemsInCart: { [key: number]: boolean };
  itemCount: number;
  totalPrice: number; // Начальное значение общей стоимости
  setItemsInCart: (items: { [key: number]: boolean }) => void;
  addItemToCart: (id: number) => void;
  removeItemFromCart: (id: number) => void;
  resetItemCount: () => void;
  setTotalPrice: (newTotalPrice: number) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      itemsInCart: {},
      itemCount: 0,
      setItemsInCart: (items) =>
        set((state) => ({ itemsInCart: { ...state.itemsInCart, ...items } })),
      addItemToCart: (id) =>
        set((state) => ({
          itemsInCart: { ...state.itemsInCart, [id]: true },
          itemCount: state.itemCount + 1,
        })),
      removeItemFromCart: (id) =>
        set((state) => {
          const updatedItems = { ...state.itemsInCart };
          delete updatedItems[id];
          return { itemsInCart: updatedItems, itemCount: state.itemCount - 1 };
        }),
      resetItemCount: () => set({ itemCount: 0 }),
      totalPrice: 0,
      setTotalPrice: (newTotalPrice) => set({ totalPrice: newTotalPrice }),
    }),
    {
      name: "cart-storage",
    }
  )
);

