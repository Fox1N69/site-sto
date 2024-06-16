import { useCartStore } from "@/store/cartStore";

type CartState = {
  itemCount: number;
  addItem: () => void;
  removeItem: () => void;
};

export const useTypedSelector = <T>(selector: (state: CartState) => T): T => {
  return useCartStore(selector as (state: unknown) => T);
};
