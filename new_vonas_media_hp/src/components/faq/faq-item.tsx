import React from "react";

// prop type
type IProps = {
  item: {
    id?: number;
    question: string;
    answer: string;
    order: number;
    category?: string;
    isActive: boolean;
  };
  index?: number;
};

export default function FaqItem({ item, index }: IProps) {
  const uniqueId = index !== undefined ? index : (item.id || item.order);
  
  return (
    <div className="accordion-items">
      <h2 className="accordion-header">
        <button
          className="accordion-buttons collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${uniqueId}`}
          aria-expanded="true"
          aria-controls={`collapse-${uniqueId}`}
        >
          {item.question}
          <span className="accordion-icon"></span>
        </button>
      </h2>
      <div
        id={`collapse-${uniqueId}`}
        className="accordion-collapse collapse"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}
