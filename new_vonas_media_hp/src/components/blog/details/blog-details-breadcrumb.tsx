import React from "react";
import Image from "next/image";
import overlay from "@/assets/img/inner-blog/blog-details/bg-shape/overly.png";
import avatar from "@/assets/img/inner-blog/blog-details/avatar/avatar-2.jpg";

interface BlogDetailsBreadcrumbProps {
  blog: any;
}

export default function BlogDetailsBreadcrumb({ blog }: BlogDetailsBreadcrumbProps) {
  const isFromCMS = blog && blog._id && !blog.id;
  const title = isFromCMS ? blog.title : "Cultivating Originality In Photography";
  const category = isFromCMS 
    ? (blog.categories && blog.categories.length > 0 ? blog.categories[0] : "News")
    : "Creative";
  const publishedAt = isFromCMS 
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    : "01 Oct, 2022";
  const authorName = isFromCMS 
    ? (blog.author?.name || "Vonas Media")
    : "Mike Granetz";
  const heroImage = isFromCMS 
    ? blog.heroImage 
    : "/assets/img/inner-blog/blog-details/blog-details-1.jpg";
  const authorImage = isFromCMS 
    ? (blog.author?.image || avatar)
    : avatar;
  return (
    <div className="blog-details-area">
      <div className="blog-details-bg blog-details-bg-height blog-details-overlay p-relative d-flex align-items-end pt-170 pb-170">
        {/* Featured Image */}
         <div className="blog-details-hero-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
           <Image 
             src={heroImage || "/assets/img/inner-blog/blog-details/blog-details-1.jpg"} 
             alt={title || "Blog post"}
             fill
             style={{ objectFit: 'cover' }}
             priority
           />
         </div>
        <div className="blog-details-overlay-shape" style={{ zIndex: 2 }}>
          <Image src={overlay} alt="overlay" />
        </div>
        <div className="container" style={{ zIndex: 3, position: 'relative' }}>
          <div className="row">
            <div className="col-xl-11">
              <div className="blog-details-content z-index-5">
                <span className="blog-details-meta">
                  {category} <i>. {publishedAt}</i>
                </span>
                <h4 className="blog-details-title tp-char-animation">
                  {title}
                </h4>
                <div className="blog-details-top-author d-flex align-items-center">
                  <Image 
                    src={typeof authorImage === 'string' ? authorImage : avatar} 
                    alt="avatar" 
                    width={40} 
                    height={40} 
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span>
                    {authorName} / <i>5 min</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
