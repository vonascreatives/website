/**
 * Utility function to process Sanity CMS rich text bio content
 * Handles various formats: arrays, single objects, and strings
 */
export function processBioContent(bio: any): string {
  if (!bio) {
    return 'Professional content creator specializing in engaging and authentic content.';
  }

  // If bio is a rich text array from Sanity (richBody type)
  if (Array.isArray(bio)) {
    const textContent = bio
      .map((block: any) => {
        if (block && block._type === 'block' && block.children) {
          return block.children
            .map((child: any) => child?.text || '')
            .join('');
        }
        return '';
      })
      .filter(text => text.trim() !== '')
      .join(' ');
    
    return textContent || 'Professional content creator specializing in engaging and authentic content.';
  }

  // If bio is a simple string
  if (typeof bio === 'string') {
    return bio;
  }

  // If bio is an object (single rich text block), extract text
  if (bio && typeof bio === 'object') {
    if (bio._type === 'block' && bio.children) {
      const textContent = bio.children
        .map((child: any) => child?.text || '')
        .join('');
      return textContent || 'Professional content creator specializing in engaging and authentic content.';
    }
  }

  // Fallback
  return 'Professional content creator specializing in engaging and authentic content.';
}