import { Input } from "@nextui-org/input";
import { useState } from "react";

type FiltersProps = {
  filters: {
    brand_name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  };
  setFilters: (filters: {
    brand_name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
};

const BrandFileter: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <>
      <h4>Выберите бренд</h4>
      <Input
        variant="bordered"
        isClearable
        fullWidth
        label="Бренд"
        name="brand"
        value={localFilters.brand_name}
        onChange={handleInputChange}
      />
    </>
  );
};

export default BrandFileter;
