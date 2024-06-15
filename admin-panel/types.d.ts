export interface DeletedAt {
  Time: string;
  Valid: boolean;
}

export interface Category {
  id: number;
  deleted_at: DeletedAt;
  name: string;
  AutoParts: any;
  Brands: any;
}

export interface Brand {
  id: number;
  deleted_at: DeletedAt;
  name: string;
  AutoParts: any;
  Categories: any;
}

export interface Product {
  id: number;
  deleted_at: DeletedAt;
  name: string;
  price: number;
  img: string;
  model_name: string;
  category_id: number;
  Category: Category;
  category_name?: string; // Добавляем это поле
  brand_id: number;
  Brand: Brand;
  brand_name?: string; // Добавляем это поле
  auto_part_info: any;
  stock: number;
}
