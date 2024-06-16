export const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:4000/shop/categorys");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchBrands = async () => {
  try {
    const response = await fetch("http://localhost:4000/shop/brands");
    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};
