import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Slider } from "@nextui-org/react";

interface PriceFilterProps {
  onFilter: (minPrice: number, maxPrice: number) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ onFilter }) => {
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const handleFilter = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min) && !isNaN(max) && min <= max) {
      onFilter(min, max);
    } else {
      alert("Please enter valid price range");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4" >
      <h2 className="text-lg font-medium">Фильтр по цене</h2>
      <div className="flex flex-row gap-2 w-[260px]">
        <Input
          aria-label="От"
          type="number"
          placeholder="От "
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          size="sm"
        />
        <Input
          aria-label="До"
          type="number"
          placeholder="До"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          size="sm"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
