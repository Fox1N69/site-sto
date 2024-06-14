"use client";
import React from "react";
import AddToCartButton from "@components/cart/AddToCartButton";
import { AutoPart } from "@/types";
import CartCounter from "@/components/cart/CartCouter";

const CardAction: React.FC<{ product: AutoPart }> = ({ product }) => {
  // Проверка, что товар действительно в корзине: cartItemID существует и количество больше 0
  const isInCart = product.cartItemID !== undefined && product.quantity > 0;

  if (isInCart) {
    return (
      <CartCounter autoPartID={product.id} initialQuantity={product.quantity} />
    );
  } else {
    return <AddToCartButton autopartID={product.id} quantity={1} />;
  }
};

export default CardAction;
