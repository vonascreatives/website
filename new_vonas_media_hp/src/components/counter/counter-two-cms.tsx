'use client';
import React from "react";
import CounterItem from "./counter-item";

interface CounterData {
  _id?: string;
  title?: string;
  counters: Array<{
    label: string;
    count: number;
    prefix?: string;
    suffix?: string;
    displayOrder: number;
  }>;
}

interface CounterTwoCmsProps {
  counterData: CounterData;
}

export default function CounterTwoCms({ counterData }: CounterTwoCmsProps) {
  return (
    <div className="row gx-0">
      {counterData.counters.map((item, index) => (
        <div key={index} className="col-xl col-lg col-md col-sm-4 col-6">
          <div className="tp-studio-funfact-item text-start text-md-center">
            <h4 className="tp-studio-funfact-title">
              {item.prefix && <span>{item.prefix}</span>}
              <CounterItem min={0} max={item.count} />
              {item.suffix && <span>{item.suffix}</span>}
            </h4>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
