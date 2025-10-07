// Dynamic font loading utility for Google Fonts
import { logger } from '@/utils/logger';

export interface Font {
  name: string;
  weights?: string[];
  variants?: string[];
}

// Cache to track loaded fonts
const loadedFonts = new Set<string>();

// Google Fonts families that are commonly available
const googleFontsFamilies = new Set([
  'Big Shoulders Display',
  'Syne',
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Source Sans Pro',
  'Raleway',
  'PT Sans',
  'Ubuntu',
  'Nunito',
  'Merriweather',
  'Playfair Display',
  'Oswald',
  'Work Sans',
  'Fira Sans',
  'Libre Franklin',
  'DM Sans'
]);

// Common system fonts as fallbacks
const systemFonts = new Set([
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS'
]);

/**
 * Load Google Font dynamically
 */
export async function loadGoogleFont(fontName: string, weights: string[] = ['400', '700']): Promise<boolean> {
  const fontKey = `${fontName}-${weights.join(',')}`; 
  
  // Skip if already loaded
  if (loadedFonts.has(fontKey)) {
    return true;
  }

  try {
    // Check if it's a system font (no need to load)
    if (systemFonts.has(fontName)) {
      loadedFonts.add(fontKey);
      return true;
    }

    // Only attempt to load known Google Fonts
    if (!googleFontsFamilies.has(fontName)) {
      logger.warn(`Font "${fontName}" is not in the Google Fonts list. Using fallback.`);
      return false;
    }

    // Create Google Fonts URL
    const fontNameEncoded = fontName.replace(/ /g, '+');
    const weightsParam = weights.join(',');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontNameEncoded}:wght@${weightsParam}&display=swap`;

    // Check if font link already exists
    const existingLink = document.querySelector(`link[href*="${fontNameEncoded}"]`);
    if (existingLink) {
      loadedFonts.add(fontKey);
      return true;
    }

    // Load the font
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    
    return new Promise((resolve) => {
      link.onload = () => {
        // Convert preload to stylesheet
        link.rel = 'stylesheet';
        loadedFonts.add(fontKey);
        resolve(true);
      };
      
      link.onerror = () => {
        logger.warn(`Failed to load Google Font: ${fontName}`);
        resolve(false);
      };
      
      document.head.appendChild(link);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (!loadedFonts.has(fontKey)) {
          logger.warn(`Font loading timeout: ${fontName}`);
          resolve(false);
        }
      }, 5000);
    });

  } catch (error) {
    logger.error(`Error loading font ${fontName}:`, error);
    return false;
  }
}

/**
 * Load multiple fonts
 */
export async function loadFonts(fonts: Font[]): Promise<boolean[]> {
  const promises = fonts.map(font => 
    loadGoogleFont(font.name, font.weights || ['400', '700'])
  );
  
  return Promise.all(promises);
}

/**
 * Get safe font family string with fallbacks
 */
export function getSafeFontFamily(fontName: string, type: 'serif' | 'sans-serif' | 'monospace' = 'sans-serif'): string {
  const fallbacks = {
    'serif': 'Times New Roman, serif',
    'sans-serif': 'Arial, Helvetica, sans-serif', 
    'monospace': 'Courier New, monospace'
  };
  
  return `"${fontName}", ${fallbacks[type]}`;
}

/**
 * Check if font is loaded and available
 */
export function isFontLoaded(fontName: string): boolean {
  if (systemFonts.has(fontName)) return true;
  
  // Try to detect if custom font is loaded by checking computed styles
  try {
    const testElement = document.createElement('div');
    testElement.style.fontFamily = `"${fontName}", monospace`;
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.textContent = 'test';
    document.body.appendChild(testElement);
    
    const computedFont = window.getComputedStyle(testElement).fontFamily;
    document.body.removeChild(testElement);
    
    return computedFont.includes(fontName);
  } catch {
    return false;
  }
}

/**
 * Preload fonts for better performance
 */
export function preloadChannelFonts(typography: Font[]) {
  if (typeof window === 'undefined') return; // Skip on server
  
  // Load fonts in the background
  setTimeout(() => {
    loadFonts(typography).then(results => {
      const loaded = results.filter(r => r).length;
      logger.info(`Loaded ${loaded}/${typography.length} channel fonts`);
    });
  }, 100);
}
