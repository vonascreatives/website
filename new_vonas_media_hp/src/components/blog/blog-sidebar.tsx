import React from "react";
import Image from "next/image";
import avatar from "@/assets/img/inner-blog/blog-sidebar/avatar/avata-2.jpg";
import banner from "@/assets/img/inner-blog/blog-sidebar/banner/banner.jpg";
import { Search } from "../svg";
import { blog_classic } from "@/data/blog-data";
import Link from "next/link";

interface BlogSidebarProps {
  recentPosts?: any[];
  categories?: string[];
}

export default function BlogSidebar({ recentPosts = [], categories = [] }: BlogSidebarProps) {
  // Use CMS recent posts or fallback to template data
  const rc_posts = recentPosts.length > 0 
    ? recentPosts.slice(0, 3)
    : [...blog_classic.filter((b) => b.img)].slice(0, 3);
  return (
    <div className="sidebar__wrapper">
      <div className="sidebar__widget mb-45">
        <div className="sidebar__author text-center">
          <div className="sidebar__author-thumb">
            <Image src={avatar} alt="avatar" style={{ height: "auto" }} />
          </div>
          <div className="sidebar__author-content">
            <h4 className="sidebar__author-title">Maria Santos</h4>
            <p>Content creator redefining media for the digital age.</p>
          </div>
        </div>
      </div>
      <div className="sidebar__widget mb-65">
        <div className="sidebar__widget-content">
          <div className="sidebar__search">
            <form action="#" role="search">
              <div className="sidebar__search-input-2">
                <label htmlFor="blog-search" className="sr-only">
                  Search articles
                </label>
                <input 
                  id="blog-search"
                  type="text" 
                  placeholder="Search articles"
                  aria-label="Search articles"
                />
                <button 
                  type="submit"
                  aria-label="Submit search"
                >
                  <Search />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="sidebar__widget mb-65">
        <h3 className="sidebar__widget-title">Categories</h3>
        <div className="sidebar__widget-content">
          <ul>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <li key={index}>
                  <Link href={`/news?category=${category}`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/news?category=social-issues">Social Issues</Link></li>
                <li><Link href="/news?category=filipino-culture">Filipino Culture</Link></li>
                <li><Link href="/news?category=music-arts">Music & Arts</Link></li>
                <li><Link href="/news?category=digital-media">Digital Media</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="sidebar__widget mb-65">
        <h3 className="sidebar__widget-title">Recent Post</h3>
        <div className="sidebar__widget-content">
          <div className="sidebar__post rc__post">
            {rc_posts.map((item) => {
              // Handle both CMS data format and template data format
              const isFromCMS = item._id && !item.id;
              const itemId = isFromCMS ? item._id : item.id;
              const itemTitle = isFromCMS ? item.title : item.title;
              const itemImage = isFromCMS ? item.heroImage : item.img;
              const itemDate = isFromCMS 
                ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : item.date;
              const linkUrl = isFromCMS ? `/news/${item.slug?.current}` : `/(blog)/blog-details/${item.id}`;
              
              return (
                <div
                  key={itemId}
                  className="rc__post mb-30 d-flex align-items-center"
                >
                  <div className="rc__post-thumb mr-20">
                    <Link href={linkUrl}>
                      <Image
                        src={itemImage!}
                        alt="blog-img"
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: '8px' }}
                      />
                    </Link>
                  </div>
                  <div className="rc__post-content">
                    <div className="rc__meta d-flex align-items-center">
                      <span>{itemDate}</span>
                    </div>
                    <h3 className="rc__post-title">
                      <Link href={linkUrl}>{itemTitle}</Link>
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="sidebar__widget mb-65">
        <h3 className="sidebar__widget-title">Tags</h3>
        <div className="sidebar__widget-content">
          <div className="tagcloud">
            <a href="#">Creative</a>
            <a href="#">Vision</a>
            <a href="#">Popular</a>
            <a href="#">Photography</a>
            <a href="#">Lifestyle</a>
          </div>
        </div>
      </div>
      <div className="sidebar__widget mb-65">
        <div className="sidebar__widget-content">
          <div className="sidebar__banner-img">
            <Image src={banner} alt="banner" style={{ height: "auto" }} />
          </div>
        </div>
      </div>
      <div className="sidebar__widget mb-65">
        <h3 className="sidebar__widget-title">Follow Us</h3>
        <div className="sidebar__widget-content">
          <div className="sidebar__social">
            <a href="#">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
