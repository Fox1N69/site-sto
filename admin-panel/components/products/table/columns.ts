const flattenProducts = (products: any[]) => {
  return products.map((product) => ({
    ...product,
    category_name: product.Category?.name,
    brand_name: product.Brand?.name,
  }));
};

export const columns = [
  { name: "Название", uid: "name" },
  { name: "Модель", uid: "model_name" },
  { name: "Цена", uid: "price" },
  { name: "Категория", uid: "category_name" },
  { name: "ACTIONS", uid: "actions" },
];
