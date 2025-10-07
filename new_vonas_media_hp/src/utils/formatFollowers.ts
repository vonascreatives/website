/**
 * Formats follower count numbers according to business rules:
 * - Numbers >= 1,000,000: Display as "1.3M"
 * - Numbers >= 1,000: Display as "50K" or "655K"  
 * - Numbers < 1,000: Display actual number
 */
export function formatFollowers(count: number): string {
  if (count >= 1000000) {
    // For millions, show one decimal place if needed
    const millions = count / 1000000;
    if (millions === Math.floor(millions)) {
      return `${Math.floor(millions)}M`;
    }
    return `${millions.toFixed(1)}M`;
  } else if (count >= 1000) {
    // For thousands, no decimal places
    const thousands = Math.floor(count / 1000);
    return `${thousands}K`;
  } else {
    // For numbers under 1000, show actual number
    return count.toString();
  }
}

/**
 * Formats follower count with "Followers" suffix
 */
export function formatFollowersWithLabel(count: number): string {
  return `${formatFollowers(count)} Followers`;
}

/**
 * Parses subscriber string (like "2.8M") to number
 */
export function parseSubscriberString(subscriberString: string): number {
  if (!subscriberString) return 0;
  
  const str = subscriberString.toLowerCase().trim();
  const numStr = str.replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr);
  
  if (str.includes('m')) {
    return Math.floor(num * 1000000);
  } else if (str.includes('k')) {
    return Math.floor(num * 1000);
  } else {
    return Math.floor(num);
  }
}

/**
 * Extract follower count from text (bio, headline, etc.)
 */
export function extractFollowerCountFromText(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  // Look for patterns like "2.2M followers", "500K followers", etc.
  const followerPattern = /([0-9.]+)\s*([kmb])\s*followers?/i;
  const match = text.match(followerPattern);
  
  if (match) {
    const num = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit === 'b') {
      return Math.floor(num * 1000000000);
    } else if (unit === 'm') {
      return Math.floor(num * 1000000);
    } else if (unit === 'k') {
      return Math.floor(num * 1000);
    }
  }
  
  return 0;
}

/**
 * Get follower count from creator data (handles both number and string formats)
 */
export function getCreatorFollowerCount(creator: any): number {
  // If totalFollowers is a reasonable number, use it
  if (creator.totalFollowers && creator.totalFollowers > 1000) {
    return creator.totalFollowers;
  }
  
  // Otherwise try to parse the subscribers string
  if (creator.subscribers) {
    return parseSubscriberString(creator.subscribers);
  }
  
  // Try to extract from bio or headline text
  if (creator.bio) {
    // Handle rich text bio (array of blocks) or plain string
    const bioText = Array.isArray(creator.bio) 
      ? creator.bio.map((block: any) => 
          block.children?.map((child: any) => child.text).join('') || ''
        ).join(' ')
      : creator.bio;
    const bioCount = extractFollowerCountFromText(bioText);
    if (bioCount > 0) return bioCount;
  }

  if (creator.headline && typeof creator.headline === 'string') {
    const headlineCount = extractFollowerCountFromText(creator.headline);
    if (headlineCount > 0) return headlineCount;
  }
  
  // Fallback to sum of metrics
  if (creator.metrics && creator.metrics.length > 0) {
    return creator.metrics.reduce((sum: number, metric: any) => sum + (metric.followers || 0), 0);
  }
  
  return 0;
}
