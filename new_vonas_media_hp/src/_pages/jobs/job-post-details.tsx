"use client";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import FooterOne from "@/layouts/footers/footer-one";
import JobPostDetailsArea from "@/components/jobs/details/job-post-details-area";
import JobPostDetailsBreadcrumb from "@/components/jobs/details/job-post-details-breadcrumb";
import { JobPost } from "@/lib/sanity-queries";

// prop type for Job Post data
interface JobPostDetailsMainProps {
  jobPost: JobPost;
  operationsManager?: any;
}

const JobPostDetailsMain = ({ jobPost, operationsManager }: JobPostDetailsMainProps) => {

  useScrollSmooth();

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderOne />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* job post details hero */}
            <JobPostDetailsBreadcrumb jobPost={jobPost} />
            {/* job post details hero */}

            {/* job post details area */}
            <JobPostDetailsArea jobPost={jobPost} operationsManager={operationsManager} />
            {/* job post details area */}
          </main>

          {/* footer area */}
          <FooterOne />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default JobPostDetailsMain;
