import { filterProps } from "framer-motion";
import PriceFilter from "./filter-price";
import { Button } from "@nextui-org/button";

const Filters = () => {
  return (
    <div className="border rounded-lg shadow-sm bg-white flex flex-col">
      <PriceFilter
        onFilter={() => {
          console.log("price - filter");
        }}
      />

      <Button onPress={() => {console.log("фильтры применен")}}>Применить фильтр</Button>
    </div>
  );
};

export default Filters;
