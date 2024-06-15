import { isSameDay } from "date-fns";
interface Product {
  id: number;
  name: string;
  modelName: string;
  img_url?: string;
  price: number;
  stock: number;
  Brand?: Brand[];
  Category: Category[];
  autoPartAboutInfo?: AutoPartInfo[];
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface AutoPartInfo {
  id: number;
  title: string;
  description: string;
}
