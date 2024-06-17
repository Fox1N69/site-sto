import { filterProps } from "framer-motion";
import PriceFilter from "./filter-price";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/react";
import BrandFileter from "./brand-filter";

const Filters = () => {
  const brand_name = "test";
  const category = "test";
  return (
    <Card className=" rounded-lg">
      <PriceFilter
        onFilter={() => {
          console.log("price - filter");
        }}
      />

      <Button
        onPress={() => {
          console.log("фильтры применен");
        }}
      >
        Применить фильтр
      </Button>
    </Card>
  );
};

export default Filters;
