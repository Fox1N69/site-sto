import { Product } from "@/types";

const calculateTotalPrice = (products: Product[]): number => {
  let totalPrice = 0;

  products.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });

  return totalPrice;
};

const totalPrice = calculateTotalPrice(productsInCart);
console.log("Total Price:", totalPrice); // Выведет общую ст
