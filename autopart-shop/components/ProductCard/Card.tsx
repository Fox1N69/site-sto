import React from "react";
import Image from "next/image";
import styles from "./Card.module.scss";
import { AutoPart } from "@/types";

interface CardProps {
  part: AutoPart;
}

const Card: React.FC<CardProps> = ({ part }) => {
  return (
    <article className={styles.card}>
      <div className={styles.card__container}>
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
            <p>{part.Brand?.name}</p>
            <p>{part.Category?.name}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
