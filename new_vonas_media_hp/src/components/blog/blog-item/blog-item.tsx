import React from "react";
import Image from "next/image";
import { IBlogDT } from "@/types/blog-d-t";
import { StaticImageData } from "next/image";
import Link from "next/link";

interface ExtendedBlogItem extends Omit<IBlogDT, 'id' | 'img'> {
  id: string | number;
  img?: StaticImageData | string;
  slug?: string;
}

export default function BlogItem({ item }: { item: ExtendedBlogItem }) {
  // Determine the correct URL based on whether we have a slug or numeric ID
  const blogUrl = item.slug ? `/news/${item.slug}` : `/(blog)/blog-details/${item.id}`;
  
  return (
    <div className="tp-blog-item">
      <div className="tp-blog-thumb fix p-relative">
        <Image 
          src={typeof item.img === 'string' ? item.img : item.img!} 
          alt="blog-img" 
          style={{ height: "auto" }}
          width={400}
          height={300}
        />
        <div className="tp-blog-meta">
          <span>{item.date}</span>
        </div>
      </div>
      <div className="tp-blog-content">
        <span>{item.category}</span>
        <h4 className="tp-blog-title-sm">
          <Link href={blogUrl}>{item.title}</Link>
        </h4>
      </div>
    </div>
  );
}
