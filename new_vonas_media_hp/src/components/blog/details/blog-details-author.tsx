import React from "react";
import Image from "next/image";
import avatar from '@/assets/img/inner-blog/blog-details/avatar/avatar-1.jpg'

interface BlogDetailsAuthorProps {
  author?: any;
}

export default function BlogDetailsAuthor({ author }: BlogDetailsAuthorProps) {
  const authorName = author?.name || "Lea Cohen";
  
  // Handle author bio - it might be an array of blocks or a string
  let authorBio = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.!";
  if (author?.bio) {
    if (Array.isArray(author.bio)) {
      // Extract text from Sanity blocks
      authorBio = author.bio
        .map((block: any) => {
          if (block._type === 'block' && block.children) {
            return block.children.map((child: any) => child.text || '').join(' ');
          }
          return '';
        })
        .filter(Boolean)
        .join(' ');
    } else if (typeof author.bio === 'string') {
      authorBio = author.bio;
    }
  }
  
  const authorImage = author?.image || avatar;
  return (
    <div className="blog-details-author d-flex mb-60">
      <div className="blog-details-author-img">
        <Image
          src={typeof authorImage === 'string' ? authorImage : avatar}
          alt={authorName}
          width={100}
          height={100}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
      <div className="blog-details-author-content-wrap">
        <div className="blog-details-author-social text-end">
          <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <div className="blog-details-author-content">
          <h4 className="blog-details-author-title">{authorName}</h4>
          <p>{authorBio}</p>
        </div>
      </div>
    </div>
  );
}
