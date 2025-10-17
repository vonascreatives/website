import React from 'react';

interface BreadcrumbProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

export default function Breadcrumb({ title, subtitle }: BreadcrumbProps) {
  return (
    <section className="breadcrumb__area include-bg pt-170 pb-90">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <div className="breadcrumb__content p-relative text-center z-index-1">
                <h3 className="breadcrumb__title" style={{ fontSize: '4rem' }}>{title}</h3>
              <div className="breadcrumb__list">
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
