"use client";
import { gsap } from "gsap";
import React, { useState, useEffect } from "react";
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
// animation
import { charAnimation } from "@/utils/title-animation";
import BlogClassicSlider from "@/components/blog/slider/blog-classic-slider";
import BlogClassicArea from "@/components/blog/blog-classic-area";
import VideoPopup from "@/components/modal/video-popup";
import { getNewsData, getSanityImageUrl } from "@/lib/sanity";

interface BlogClassicMainProps {
  blogs?: any[];
}

const BlogClassicMain = ({ blogs: propBlogs = [] }: BlogClassicMainProps) => {
  const [blogs, setBlogs] = useState<any[]>(propBlogs);
  const [loading, setLoading] = useState(propBlogs.length === 0);

  useEffect(() => {
    if (propBlogs.length === 0) {
      const fetchBlogs = async () => {
        try {
          const posts = await getNewsData();
          // Transform Sanity posts to match expected format
          const transformedPosts = posts.map((post: any) => ({
            id: post._id,
            title: post.title,
            img: post.heroImage ? getSanityImageUrl(post.heroImage) : '/assets/img/blog/blog-placeholder.jpg',
            date: new Date(post.publishedAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '.'),
            category: post.category || post.categories?.[0]?.title || 'News',
            author: post.author?.name || 'Vonas Media',
            desc: post.excerpt || '',
            slug: post.slug?.current,
            blogQuote: false,
            video: false,
            imgSlider: false,
            blogQuoteTwo: false,
            blogHeroSlider: false
          }));
          setBlogs(transformedPosts);
        } catch (error) {
          console.error('Error fetching blog posts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchBlogs();
    }
  }, [propBlogs]);
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);
  const [videoId, setVideoId] = React.useState("rVHxkxJM3rY");
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
            {/* blog classic hero start */}
            <BlogClassicSlider />
            {/* blog classic hero end */}

            {/* blog classic area area */}
            {loading ? (
              <div className="text-center py-5">
                <p>Loading blog posts...</p>
              </div>
            ) : (
              <BlogClassicArea setIsVideoOpen={setIsVideoOpen} setVideoId={setVideoId} blogs={blogs} />
            )}
            {/* blog classic area area */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>

      {/* video popup */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={videoId}
      />
      {/* video popup */}
    </Wrapper>
  );
};

export default BlogClassicMain;
