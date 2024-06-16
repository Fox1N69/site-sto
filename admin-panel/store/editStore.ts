import { Brand } from "./../types.d";
import create from "zustand";

interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand) => void;
}

export const useEditStore = create<CategoryState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  selectedBrand: null,
  setSelectedBrand: (brand: Brand) => set({ selectedBrand: brand }),
}));
