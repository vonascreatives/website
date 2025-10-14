import React from "react";
import CounterItem from "../counter/counter-item";
import { Leaf } from "../svg";

interface FunFactData {
  _id?: string;
  title: string;
  subtitle: string;
  facts: Array<{
    title: string;
    count: number;
    suffix: string;
    displayOrder: number;
  }>;
}

interface FunFactOneCmsProps {
  funFactsData: FunFactData;
}

export default function FunFactOneCms({ funFactsData }: FunFactOneCmsProps) {
  return (
    <div className="ab-funfact-area pb-40">
      <div className="container container-1480">
        <div className="row">
          <div className="col-xl-4">
            <div className="ab-funfact-title-box">
              <span className="ab-inner-subtitle mb-25">
                <Leaf />
                {funFactsData.subtitle}
              </span>
              <h4 className="ab-inner-funfact-title tp_title_anim">
                {funFactsData.title.split(' ').map((word, index, array) => (
                  <React.Fragment key={index}>
                    {word}
                    {index < array.length - 2 && ' '}
                    {index === array.length - 2 && <br />}
                    {index === array.length - 1 && ''}
                  </React.Fragment>
                ))}
              </h4>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="ab-funfact-wrap">
              <div className="row gx-75">
                {funFactsData.facts.map((item, index) => (
                  <div key={index} className="col-xl-6 col-lg-6 col-md-6">
                    <div className="ab-funfact-item mb-90">
                      <span>
                        <CounterItem min={0} max={item.count} />
                        {item.suffix}
                      </span>
                      <p>{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
