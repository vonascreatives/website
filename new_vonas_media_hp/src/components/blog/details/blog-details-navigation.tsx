'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PrevArrow, NextArrow } from "@/components/svg";
import { getNewsData } from "@/lib/sanity";

interface BlogDetailsNavigationProps {
  currentArticleId: string;
}

interface NavigationPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export default function BlogDetailsNavigation({ currentArticleId }: BlogDetailsNavigationProps) {
  const [prevPost, setPrevPost] = useState<NavigationPost | null>(null);
  const [nextPost, setNextPost] = useState<NavigationPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavigationPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await getNewsData();
        
        if (!allPosts || allPosts.length === 0) {
          setLoading(false);
          return;
        }
        
        // Sort posts by publishedAt date (oldest first)
        const sortedPosts = allPosts.sort((a: any, b: any) => 
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
        
        // Find current post index
        const currentIndex = sortedPosts.findIndex((post: any) => 
          post._id === currentArticleId || post.id === currentArticleId
        );
        
        if (currentIndex === -1) {
          setLoading(false);
          return;
        }
        
        // Set previous post (newer post)
        const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
        const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
        
        setPrevPost(prevPost);
        setNextPost(nextPost);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching navigation posts:', error);
        setLoading(false);
      }
    };

    if (currentArticleId) {
      fetchNavigationPosts();
    }
  }, [currentArticleId]);

  if (loading) {
    return (
      <div className="blog-details-navigation d-flex align-items-center justify-content-between">
        <div className="blog-details-navigation-prev">
          <span className="d-flex align-items-center opacity-50">
            <span className="blog-details-navigation-icon">
              <PrevArrow />
            </span>
            <span className="blog-details-navigation-text">
              <span className="blog-details-navigation-label">Loading...</span>
            </span>
          </span>
        </div>
        <div className="blog-details-navigation-next">
          <span className="d-flex align-items-center opacity-50">
            <span className="blog-details-navigation-text">
              <span className="blog-details-navigation-label">Loading...</span>
            </span>
            <span className="blog-details-navigation-icon">
              <NextArrow />
            </span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-details-navigation d-flex align-items-center justify-content-between">
      <div className="blog-details-navigation-prev">
        {prevPost ? (
          <Link href={`/news/${prevPost.slug.current}`} className="d-flex align-items-center">
            <span className="blog-details-navigation-icon">
              <PrevArrow />
            </span>
            <span className="blog-details-navigation-text">
              <span className="blog-details-navigation-label">Prev</span>
              <span className="blog-details-navigation-title">
                {prevPost.title.length > 30 ? `${prevPost.title.substring(0, 30)}...` : prevPost.title}
              </span>
            </span>
          </Link>
        ) : (
          <span className="d-flex align-items-center opacity-50">
            <span className="blog-details-navigation-icon">
              <PrevArrow />
            </span>
            <span className="blog-details-navigation-text">
              <span className="blog-details-navigation-label">No Previous Post</span>
            </span>
          </span>
        )}
      </div>
      <div className="blog-details-navigation-next">
        {nextPost ? (
          <Link href={`/news/${nextPost.slug.current}`} className="d-flex align-items-center">
            <span className="blog-details-navigation-text">
              <span className="blog-details-navigation-label">Next</span>
              <span className="blog-details-navigation-title">
                {nextPost.title.length > 30 ? `${nextPost.title.substring(0, 30)}...` : nextPost.title}
              </span>
            </span>
            <span className="blog-details-navigation-icon">
              <NextArrow />
            </span>
          </Link>
        ) : (
          <span className="d-flex align-items-center opacity-50">
            <span className="blog-details-navigation-text">
              <span className="blog-details-navigation-label">No Next Post</span>
            </span>
            <span className="blog-details-navigation-icon">
              <NextArrow />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
