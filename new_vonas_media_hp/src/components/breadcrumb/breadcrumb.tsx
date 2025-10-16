import React from 'react';

interface BreadcrumbProps {
  title: string;
  subtitle: string;
}

export default function Breadcrumb({ title, subtitle }: BreadcrumbProps) {
  return (
    <section className="tp-breadcrumb-area pt-200 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-breadcrumb-content text-center">
              <h3 className="tp-breadcrumb-title">{title}</h3>
              <div className="tp-breadcrumb-list">
                <span>
                  <a href="/">Home</a>
                </span>
                <span>{subtitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
