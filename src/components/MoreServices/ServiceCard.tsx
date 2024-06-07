// src/components/MoreServices/ServiceCard.jsx
import React from "react";
import "./cardlist.scss";

interface Props {
  src: any;
  alt: string;
  serviceID: string;
  title: string;
  description: string;
  isActive: boolean;
}

const ServiceCard: React.FC<Props> = ({
  src,
  alt,
  serviceID,
  title,
  isActive,
}) => {
  return (
    <a
      href={`/service/${serviceID}`}
      className={`services__card ${isActive ? "active" : ""}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className=" w-[80px] h-[120px]"
      />
      <div className="card__content">
        <div className="card-title h5-title">{title}</div>
      </div>
    </a>
  );
};

export default ServiceCard;
