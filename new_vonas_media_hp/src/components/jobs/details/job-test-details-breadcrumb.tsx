"use client";
import React from "react";
import { JobTest } from "@/lib/sanity-queries";

interface JobTestDetailsBreadcrumbProps {
  jobTest: JobTest;
}

const JobTestDetailsBreadcrumb: React.FC<JobTestDetailsBreadcrumbProps> = ({ jobTest }) => {
  return (
    <section className="breadcrumb-area breadcrumb-overlay" 
             style={{
               backgroundImage: "url('/assets/img/breadcrumb/breadcrumb-bg.jpg')"
             }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="breadcrumb-content text-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/job-tests">Job Tests</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {jobTest.title}
                  </li>
                </ol>
              </nav>
              <h1 className="breadcrumb-title">{jobTest.title}</h1>
              
              <div className="job-test-meta">
                <div className="meta-item">
                  <span className="meta-label">Order:</span>
                  <span className="meta-value">{jobTest.order}</span>
                </div>
                
                {jobTest.contactPerson && (
                  <div className="meta-item">
                    <span className="meta-label">Contact:</span>
                    <span className="meta-value">{jobTest.contactPerson.name}</span>
                  </div>
                )}
                
                <div className="meta-item">
                  <span className="meta-label">Status:</span>
                  <span className={`meta-value status-${jobTest.isActive ? 'active' : 'inactive'}`}>
                    {jobTest.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      <div className="breadcrumb-overlay-bg"></div>
    </section>
  );
};

export default JobTestDetailsBreadcrumb;