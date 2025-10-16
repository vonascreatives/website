import React from "react";
import Image from "next/image";
import Link from "next/link";
import usePagination from "@/hooks/use-pagination";
import Pagination from "../ui/pagination";

// Sample job data to match Liko template structure
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

interface JobListAreaProps {
  jobs?: any[];
}

export default function JobListArea({ jobs = [] }: JobListAreaProps) {
  // Use sample data if no jobs provided, matching Liko template behavior
  const job_items = jobs.length > 0 ? jobs : [...sample_jobs];
  const { currentItems, handlePageClick, pageCount } = usePagination(job_items, 4);
  
  return (
    <div className="tp-blog-list-area mb-30">
      <div className="container container-1480">
        <div className="tp-blog-list-wrap">
          {currentItems.map((item) => (
            <div key={item.id || item._id} className="tp-blog-list-item">
              <div className="row">
                <div className="col-xl-2 col-lg-2 tp-flex-end">
                  <div className="tp-blog-list-meta">
                    <span>{item.date || new Date().toLocaleDateString('en-US', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    }).replace(',', '').toUpperCase()}</span>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-5 col-md-7">
                  <div className="tp-blog-list-content-wrap">
                    <div className="tp-blog-list-thumb anim-zoomin-wrap">
                      <Link href={`/jobs/${item.slug || item.slug?.current}`}>
                        <Image
                          className="anim-zoomin"
                          src={item.img || item.mainImage?.asset?.url || '/assets/img/inner-blog/blog-right-sidebar/blog-1.jpg'}
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
                        <Link href={`/jobs/${item.slug || item.slug?.current}`}>{item.title}</Link>
                      </h4>
                    </div>
                    <div className="tp-blog-list-link-wrap">
                      <Link className="tp-blog-list-link" href={`/jobs/${item.slug || item.slug?.current}`}>
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="col-12">
            <div className="basic-pagination mt-80 d-flex align-items-center justify-content-center">
              <nav>
                <Pagination
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
