import { create } from "zustand";

interface StoreState {
  name: string;
  setName: (name: string) => void;
  img_url: string;
  setImgUrl: (img_url: string) => void;
  brand_id: number;
  setBrandId: (brand_id: number) => void;
  release_year: number;
  setReleaseYear: (release_year: number) => void;
}

export const useModelStore = create<StoreState>((set) => {
  return {
    name: "",
    setName: (name) => set({ name }),
    img_url: "",
    setImgUrl: (img_url) => set({ img_url }),
    brand_id: 0,
    setBrandId: (brand_id) => set({ brand_id }),
    release_year: 0,
    setReleaseYear: (release_year) => set({ release_year }),
  };
});
