"use client";

import React from "react";
import Image from "next/image";
import styles from "./Card.module.scss";
import { AutoPart } from "@/types";
import ProductModal from "../ProductModal";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

interface CardProps {
  part: AutoPart;
}

const Card: React.FC<CardProps> = ({ part }) => {
  const router = useRouter();

  const handleRouteToCard = () => {
    router.push(`/autopart/${part.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation;
    console.log("add to basket");
  };

  return (
    <article className={styles.card}>
      <div className={styles.card__container} onClick={handleRouteToCard}>
        <img src={part.img} alt="" style={{ borderRadius: 10, height: 180 }} />
        <div className="card__content flex flex-col justify-between h-[45%] p-2">
          <div className="card__title">
            <h3 className={styles.card__title}>{part.name}</h3>
            <p className="card__modelname">{part.model_name}</p>
          </div>
          <div className="card__descrioption mt-2">
            <p>Описание</p>
          </div>
          <div className="info flex justify-between font-light">
            <p>{part.price}</p>
            <Button onClick={handleAddToCart}></Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
