export interface AutoPart {
  id: number;
  name: string;
  price: number;
  img: string;
  category_id: number;
  brand_id: number;
  stock: number;
  auto_part_info?: AutoPartInfo[];
  Category?: Category;
  Brand?: Brand;
  model_name?: string;
}

export interface AutoPartInfo {
  id: number;
  title: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}
