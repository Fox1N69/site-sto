import React, { useState } from "react";

const CartCounter = () => {
  const [count, setCount] = useState<number>(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
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
