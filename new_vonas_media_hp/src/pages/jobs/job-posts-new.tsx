"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import useScrollSmooth from "@/hooks/use-scroll-smooth";

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import FooterOne from "@/layouts/footers/footer-one";
import BigText from "@/components/big-text";

// Sample job data matching Liko template - will be replaced with CMS data
const sample_jobs = [
  {
    id: 1,
    date: "01 DEC, 2023",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-1.jpg",
    title: "Senior Frontend Developer",
    slug: "senior-frontend-developer"
  },
  {
    id: 2,
    date: "15 NOV, 2023",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-2.jpg",
    title: "UX/UI Designer",
    slug: "ux-ui-designer"
  },
  {
    id: 3,
    date: "28 OCT, 2023",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-3.jpg",
    title: "Backend Developer",
    slug: "backend-developer"
  },
  {
    id: 4,
    date: "10 OCT, 2023",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-4.jpg",
    title: "Product Manager",
    slug: "product-manager"
  }
];

interface JobPostsMainNewProps {
  initialJobs?: any[];
}

const JobPostsMainNew = ({ initialJobs = [] }: JobPostsMainNewProps) => {
  useScrollSmooth();
  
  // Use CMS data if available, otherwise fallback to sample data
  const job_items = initialJobs.length > 0 ? initialJobs.map(job => ({
    id: job._id,
    date: new Date(job.publishedAt).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).replace(',', '').toUpperCase(),
    img: job.mainImage || '/assets/img/inner-blog/blog-right-sidebar/blog-1.jpg',
    title: job.title,
    slug: job.slug.current
  })) : sample_jobs;

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderOne />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* Jobs Page Header */}
            <div className="tp-blog-list-banner">
              <div
                className="tp-blog-list-bg tp-blog-list-bg-overlay"
                style={{backgroundImage: job_items.length > 0 && job_items[0].img ? `url(${job_items[0].img})` : `url(/assets/img/inner-blog/blog-right-sidebar/blog-banner.jpg)`}}
              >
                <div className="container z-index">
                  <div className="row align-items-end">
                    <div className="col-xl-7 col-lg-7 col-md-7">
                      <div className="tp-blog-list-title-box">
                        <h2 className="tp-section-title fs-160 tp-char-animation">
                          Jobs
                        </h2>
                      </div>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-md-5">
                       <div className="tp-blog-list-text text-start text-md-end">
                         <span>CAREER OPPORTUNITIES</span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liko Template Job List */}
            <div className="tp-blog-list-area mb-30">
              <div className="container container-1480">
                <div className="tp-blog-list-wrap">
                  {job_items.map((item) => (
                    <div key={item.id} className="tp-blog-list-item">
                      <div className="row">
                        <div className="col-xl-2 col-lg-2 tp-flex-end">
                          <div className="tp-blog-list-meta">
                            <span>{item.date}</span>
                          </div>
                        </div>
                        <div className="col-xl-5 col-lg-5 col-md-7">
                          <div className="tp-blog-list-content-wrap">
                            <div className="tp-blog-list-thumb anim-zoomin-wrap">
                              <Link href={`/jobs/${item.slug}`}>
                                <Image
                                  className="anim-zoomin"
                                  src={item.img}
                                  alt="job-img"
                                  width={500}
                                  height={300}
                                  style={{height: "auto"}}
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-5 col-lg-5 col-md-5">
                          <div className="tp-blog-list-content tp-flex-column">
                            <div className="tp-blog-list-title-wrap">
                              <h4 className="tp-blog-list-title-sm">
                                <Link href={`/jobs/${item.slug}`}>{item.title}</Link>
                              </h4>
                            </div>
                            <div className="tp-blog-list-link-wrap">
                              <Link className="tp-blog-list-link" href={`/jobs/${item.slug}`}>
                                Read More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* big text area */}
            <BigText />
            {/* big text area */}
          </main>

          {/* footer area */}
          <FooterOne />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default JobPostsMainNew;