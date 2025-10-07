import React from "react";
import { blog_home_five } from "@/data/blog-data";
import BlogItemTwo from "../blog-item/blog-item-2";
import { getNewsData } from "@/lib/sanity";

interface BlogDetailsRelatedPostsProps {
  currentArticleId?: string;
}

export default function BlogDetailsRelatedPosts({ currentArticleId }: BlogDetailsRelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    if (currentArticleId) {
      getNewsData().then(data => {
        // Get other articles, excluding current one
        const otherPosts = data.filter((post: any) => post._id !== currentArticleId).slice(0, 3);
        setRelatedPosts(otherPosts);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [currentArticleId]);
  
  // Use fetched news articles if available, otherwise fall back to template data
  const blog_items = relatedPosts.length > 0 ? relatedPosts : [...blog_home_five].slice(0, 3);
  return (
    <div className="blog-details-realated-area grey-bg-2 pt-90 pb-40">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="blog-details-realated-title-box text-center mb-50">
              <h3 className="blog-details-realated-title">Related posts</h3>
            </div>
          </div>
        </div>
        <div className="row">
          {blog_items.map((item: any) => {
            const itemKey = item._id || item.id;
            return (
              <div key={itemKey} className="col-xl-4 col-lg-6 col-md-6 mb-50">
                <BlogItemTwo item={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
