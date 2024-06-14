import { Button } from "@nextui-org/button";
import { Icon } from "@iconify/react";
import { useCartStore } from "@/store/cartStore";

type CartButtonProps = {
  onClick: () => void;
};

const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <div className="relative">
      <Button isIconOnly onPress={onClick} variant="bordered">
        <Icon icon={"carbon:shopping-cart"} />
      </Button>
      {itemCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {itemCount}
        </div>
      )}
    </div>
  );
};

export default CartButton;
