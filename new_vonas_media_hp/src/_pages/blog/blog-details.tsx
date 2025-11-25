"use client";
import { gsap } from "gsap";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderEleven from "@/layouts/headers/header-eleven";
import FooterTwo from "@/layouts/footers/footer-two";
import BlogDetailsArea from "@/components/blog/details/blog-details-area";
import BlogDetailsBreadcrumb from "@/components/blog/details/blog-details-breadcrumb";
import BlogDetailsRelatedPosts from "@/components/blog/details/blog-details-related-posts";
// animation
import { charAnimation } from "@/utils/title-animation";

// prop type for Sanity CMS blog data
type IProps = {
  blog: {
    _id: string;
    id?: string;
    title: string;
    excerpt?: string;
    content?: any;
    heroImage?: string;
    publishedAt?: string;
    author?: {
      name: string;
      image?: string;
    };
    slug?: {
      current: string;
    };
    categories?: any[];
    tags?: any[];
    _type?: string;
  };
  operationsManager?: any;
};

const BlogDetailsMain = ({ blog, operationsManager }: IProps) => {

  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderEleven transparent={true} />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* blog details hero */}
            <BlogDetailsBreadcrumb blog={blog} />
            {/* blog details hero */}

            {/* blog details area */}
            <BlogDetailsArea blog={blog} operationsManager={operationsManager} />
            {/* blog details area */}

            {/* related posts */}
            <BlogDetailsRelatedPosts currentArticleId={blog?._id || blog?.id || ''} />
            {/* related posts */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default BlogDetailsMain;
