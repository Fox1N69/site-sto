import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

interface CartCounterProps {
  autoPartID: number;
  initialQuantity: number;
}

const CartCounter: React.FC<CartCounterProps> = ({
  autoPartID,
  initialQuantity,
}) => {
  const [count, setCount] = useState<number>(initialQuantity);
  const { data: session } = useSession();

  const updateQuantityOnServer = async (newQuantity: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/account/user/${session?.user.id}/update_basket/${autoPartID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Failed to update quantity on server", error);
    }
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    updateQuantityOnServer(newCount);
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      updateQuantityOnServer(newCount);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleDecrement}
        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        -
      </button>
      <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md">
        {count}
      </div>
      <button
        onClick={handleIncrement}
        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default CartCounter;
