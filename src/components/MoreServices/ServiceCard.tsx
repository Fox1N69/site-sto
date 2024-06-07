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
      <img src={src} alt={alt} />
      <div className="card__content">
        <div className="card-title h5-title">{title}</div>
      </div>
    </a>
  );
};

export default ServiceCard;
