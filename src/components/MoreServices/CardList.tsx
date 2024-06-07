// src/components/MoreServices/CardList.jsx
import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { services } from "./data";
import "./cardlist.scss";

interface Props {
  selectedServiceID: string;
}

const CardList: React.FC<Props> = ({ selectedServiceID }) => {
  const [selectedService, setSelectedService] = useState(selectedServiceID);

  useEffect(() => {
    if (selectedServiceID) {
      setSelectedService(selectedServiceID);
    }
  }, [selectedServiceID]);

  return (
    <div className="card-list">
      <ul className="card-list__container">
        {services.map((service) => (
          <li className="card-list__item" key={service.serviceID}>
            <ServiceCard
              src={service.src}
              alt={service.alt}
              serviceID={service.serviceID}
              title={service.title}
              description={service.description}
              isActive={service.serviceID === selectedService}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardList;
