import type React from "react";

interface Props {
  content: string;
  style: string;
  serviceID: string;
}
const ServiceButton: React.FC<Props> = ({ content, style, serviceID }) => {
  return (
    <a href={`/services/${serviceID}`} className={style}>
      {content}
    </a>
  );
};

export default ServiceButton;
