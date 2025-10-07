import React from "react";
import Image from "next/image";
import { IBlogDT } from "@/types/blog-d-t";
import Link from "next/link";

export default function BlogItemTwo({ item }: { item: IBlogDT | any }) {
  // Handle both CMS data and template data
  const isFromCMS = item._id && !item.id;
  const itemId = isFromCMS ? item._id : item.id;
  const itemTitle = item.title;
  const itemImage = isFromCMS ? item.heroImage : item.img;
  const itemDate = isFromCMS 
    ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : item.date;
  const itemCategory = isFromCMS 
    ? (item.categories && item.categories.length > 0 ? item.categories[0] : "News")
    : item.category;
  const linkUrl = isFromCMS ? `/news/${item.slug?.current}` : `/(blog)/blog-details/${item.id}`;
  return (
    <div className="tp-blog-item tp_fade_bottom">
      <div className="tp-blog-thumb fix p-relative">
        <Image 
          src={itemImage} 
          alt={itemTitle}
          width={400}
          height={300}
          style={{ height: "300px", width: "100%", objectFit: "cover" }} 
        />
        <div className="tp-blog-meta">
          <span>{itemDate}</span>
        </div>
      </div>
      <div className="tp-blog-content">
        <span>{itemCategory}</span>
        <h4 className="tp-blog-title-sm">
          <Link href={linkUrl}>{itemTitle}</Link>
        </h4>
      </div>
    </div>
  );
}
