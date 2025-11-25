import React from "react";
import Image from "next/image";
import avatar from '@/assets/img/inner-blog/blog-details/avatar/avatar-1.jpg'

interface BlogDetailsAuthorProps {
  author?: any;
  operationsManager?: any;
}

export default function BlogDetailsAuthor({ author, operationsManager }: BlogDetailsAuthorProps) {

  const authorData = operationsManager || author;

  const authorName = authorData?.name || "Lea Cohen";

  // Handle author bio - it might be an array of blocks or a string
  let authorBio = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.!";

  if (authorData?.bio) {
    if (Array.isArray(authorData.bio)) {
      const extractedText = authorData.bio
        .map((block: any) => {
          if (block._type === 'block' && block.children) {
            return block.children.map((child: any) => child.text || '').join(' ');
          }
          return '';
        })
        .filter(Boolean)
        .join(' ');

      if (extractedText) {
        authorBio = extractedText;
      }
    } else if (typeof authorData.bio === 'string') {
      authorBio = authorData.bio;
    }
  }


  const authorImage = authorData?.image || authorData?.photo || avatar;
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
