
export interface AffiliateLink {
  _id: string;
  offerText: string;        
  slug: string;
  appName: string;         
  year: string;
  image: string;
  imageAlt: string;
  affiliateUrl: string;
  hoverText: string;
  displayOrder: number;
  featured: boolean;
  isActive: boolean;
}

export interface AffiliateLinksProps {
  initialAffiliateLinks?: AffiliateLink[];
}
