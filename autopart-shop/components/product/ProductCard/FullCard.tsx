"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Card.module.scss";
import { AutoPart } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { handleAddToCart, checkIfInCart } from "@/hooks/fetching";

interface CardProps {
  part: AutoPart;
}

const FullCard: React.FC<CardProps> = ({ part }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      (async () => {
        const inCart = await checkIfInCart(
          session.user.id,
          session.user.token,
          part.id
        );
        setIsFollowed(inCart);
      })();
    }
  }, [part.id, session?.user]);

  const handleRouteToCard = () => {
    router.push(`/autopart/${part.id}`);
  };

  const onAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (session?.user) {
      await handleAddToCart({
        userId: session.user.id,
        token: session.user.token,
        autopartID: part.id,
        quantity: 1, // Assuming quantity 1 for now
        setIsLoading,
        setError,
      });
      setIsFollowed(true);
    } else {
      setError("You need to be logged in to add items to the cart");
    }
  };

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[810px]"
      shadow="sm"
    >
      <CardBody>
        <div className="flex gap-10 ">
          <div className="relative w-[25%]">
            <img src={part.img} alt="" className="w-full h-full rounded-lg" />
          </div>
          <div className="flex flex-col col-span-6 md:col-span-8 w-[50%]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="font-semibold text-foreground/90">
                  {part.name}
                </h3>
                <p className="text-small text-foreground/80">
                  {part.model_name}
                </p>
                <h1 className="text-large font-medium mt-2">{"Описание:"}</h1>
                <p className=" font-light ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Explicabo cupiditate officiis quisquam reiciendis placeat! Ex
                </p>
              </div>
            </div>

            <div className="flex flex-col mt-3 gap-1">
              <div className="flex justify-between">
                <p className=" text-small">рейтинг || отзывы</p>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-center ">
            <Button
              className={
                isFollowed
                  ? "bg-transparent text-foreground border-default-200"
                  : ""
              }
              color="primary"
              radius="full"
              size="sm"
              variant={isFollowed ? "bordered" : "solid"}
              onClick={onAddToCart}
            >
              {isFollowed ? "В корзине" : "В корзину"}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FullCard;
