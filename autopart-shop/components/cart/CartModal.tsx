"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import CartCouter from "./CartCouter";
import { Product } from "@/types";
import CartButton from "./CartButton";
import { useCartStore } from "@/store/cartStore";

export const calculateTotalPrice = (products: Product[]) => {
  const totalPrice = products.reduce((acc, product) => {
    const price =
      typeof product.price === "string"
        ? product.price
        : product.price.toString();
    return acc + parseFloat(price) * product.quantity;
  }, 0);
  useCartStore.getState().setTotalPrice(totalPrice);
};

export default function CartModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { data: session } = useSession();
  const { setItemsInCart, resetItemCount, setTotalPrice } = useCartStore();
  const totalPrice = useCartStore((state) => state.totalPrice);

  const handleOpen = () => {
    setOpen(true);
  };

  const fetchCartItems = async () => {
    try {
      const userId = session?.user.id;
      const response = await fetch(
        `http://localhost:4000/v1/account/user/${userId}/basket`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const extractedProducts: Product[] = data.BasketItems.map(
        (item: any) => ({
          id: item.AutoPart.id,
          name: item.AutoPart.name,
          href: "#",
          color: item.AutoPart.model_name,
          price: item.AutoPart.price.toString(),
          quantity: item.quantity,
          imageSrc: item.AutoPart.img,
          imageAlt: item.AutoPart.name,
          cartItemID: item.id,
        })
      );

      setProducts(extractedProducts);
      const itemsInCart = extractedProducts.reduce((acc, product) => {
        acc[product.id] = true;
        return acc;
      }, {} as { [key: number]: boolean });
      setItemsInCart(itemsInCart);
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    }
  };

  const removeAllItemFromBasket = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/account/user/${session?.user.id}/remove_all_items`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove item");
      }
      setProducts([]);
      setItemsInCart({});
      resetItemCount();
      setTotalPrice(0);
    } catch (error) {
      console.error("Failed to remove item from server", error);
    }
  };

  const removeItemFromBasket = async (cartItemID: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/account/user/remove_items/${cartItemID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove item");
      }
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.cartItemID !== cartItemID)
      );
      const { removeItemFromCart } = useCartStore.getState();
      removeItemFromCart(cartItemID);
    } catch (error) {
      console.error("Failed to remove item from server", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCartItems();
    }
  }, [open]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const totalPrice = products.reduce((acc, product) => {
        const price =
          typeof product.price === "string"
            ? parseFloat(product.price)
            : product.price;
        return acc + price * product.quantity;
      }, 0);
      setTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [products, setTotalPrice]);

  return (
    <>
      <CartButton onClick={handleOpen} />

      <Transition show={open}>
        <Dialog className="relative z-10" onClose={() => setOpen(false)}>
          <TransitionChild
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </DialogTitle>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {products.map((product) => (
                                <li key={product.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={product.imageSrc}
                                      alt={product.imageAlt}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href={product.href}>
                                            {product.name}
                                          </a>
                                        </h3>
                                        <p className="ml-4">{product.price}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.color}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-indigo-600">
                                        <CartCouter
                                          key={product.id}
                                          autoPartID={product.id}
                                          initialQuantity={product.quantity}
                                        />
                                      </p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-indigo-600 hover:text-indigo-500"
                                          onClick={() =>
                                            removeItemFromBasket(
                                              product.cartItemID
                                            )
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Общая цена:</p>
                          <p>{totalPrice}₽</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Стоимость доставки расчитывается при оформление заказа
                        </p>
                        <div className="mt-6">
                          <a
                            href="#"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          >
                            Оплатить
                          </a>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            или{" "}
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => setOpen(false)}
                            >
                              Продолжить покупки
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
