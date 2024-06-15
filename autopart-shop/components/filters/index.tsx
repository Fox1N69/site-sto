import { filterProps } from "framer-motion";
import PriceFilter from "./filter-price";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/react";

const Filters = () => {
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
