"use client";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import FooterOne from "@/layouts/footers/footer-one";
import JobTestDetailsArea from "@/components/jobs/details/job-test-details-area";
import JobTestDetailsBreadcrumb from "@/components/jobs/details/job-test-details-breadcrumb";
// animation removed to fix syntax error
import { JobTest } from "@/lib/sanity-queries";

// prop type for Job Test data
type IProps = {
  jobTest: JobTest;
};

const JobTestDetailsMain = ({ jobTest }: IProps) => {
  useScrollSmooth();

  // GSAP animation removed to fix syntax error

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderOne />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <JobTestDetailsBreadcrumb jobTest={jobTest} />
            <JobTestDetailsArea jobTest={jobTest} />
          </main>

          {/* footer area start */}
          <FooterOne />
          {/* footer area end */}
        </div>
      </div>
    </Wrapper>
  );
};

export default JobTestDetailsMain;
export { JobTestDetailsMain };