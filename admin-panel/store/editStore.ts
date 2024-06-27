import { Brand } from "./../types.d";
import { create } from "zustand";

interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  selectedCategories: Category[];
  toggleSelectedCategory: (category: Category) => void;
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand) => void;
}

export const useEditStore = create<CategoryState>((set) => ({
  selectedCategories: [],
  toggleSelectedCategory: (category) =>
    set((state) => {
      const isCategorySelected = state.selectedCategories.some(
        (c) => c.id === category.id
      );
      if (isCategorySelected) {
        return {
          selectedCategories: state.selectedCategories.filter(
            (c) => c.id !== category.id
          ),
        };
      } else {
        return { selectedCategories: [...state.selectedCategories, category] };
      }
    }),
  selectedBrand: null,
  setSelectedBrand: (brand: Brand) => set({ selectedBrand: brand }),
}));
