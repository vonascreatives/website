"use client";
import React from 'react';
import NiceSelect from '@/components/ui/nice-select';
import { CreatorFilters } from '@/hooks/use-creator-filters';

interface CreatorSidebarProps {
  filters: CreatorFilters;
  updateFilter: (key: keyof CreatorFilters, value: any) => void;
  addToArrayFilter: (key: 'niches' | 'platforms' | 'location', value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
  isOpen?: boolean;
  filterOptions?: {
    categories: string[];
    locations: string[];
    platforms: string[];
  };
}

export default function CreatorSidebar({ 
  filters, 
  updateFilter, 
  addToArrayFilter, 
  clearFilters, 
  hasActiveFilters,
  isOpen,
  filterOptions = { categories: [], locations: [], platforms: [] }
}: CreatorSidebarProps) {

  // Use dynamic filter options from Sanity CMS, filter out null/undefined values
  const niches = (filterOptions.categories || []).filter(Boolean);

  const followerRanges = [
    { value: '', label: 'All Followers' },
    { value: '1k-10k', label: '1K - 10K Followers' },
    { value: '10k-50k', label: '10K - 50K Followers' },
    { value: '50k-100k', label: '50K - 100K Followers' },
    { value: '100k-500k', label: '100K - 500K Followers' },
    { value: '500k-1m', label: '500K - 1M Followers' },
    { value: '1m+', label: '1M+ Followers' }
  ];

  // Use dynamic filter options from Sanity CMS, filter out null/undefined values
  const platforms = (filterOptions.platforms || []).filter(Boolean);
  const locations = (filterOptions.locations || []).filter(Boolean);

  return (
    <div className={`tp-shop-sidebar mr-10 ${isOpen ? 'sidebar-open' : ''}`}>
      
      {/* Clear Filters */}
      {hasActiveFilters() && (
        <div className="tp-shop-widget mb-50">
          <button 
            className="tp-btn-cart w-100" 
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Follower Range Filter */}
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">Follower Count</h3>
        <div className="tp-shop-widget-content">
            <div className="tp-shop-widget-filter" style={{ padding: '12px 0' }}>
            <NiceSelect
              options={followerRanges}
              defaultCurrent={followerRanges.findIndex(range => range.value === filters.followerRange)}
              onChange={(item) => updateFilter('followerRange', item.value)}
              name="FollowerRange"
            />
            </div>
        </div>
      </div>

      {/* Niche Filter */}
      {niches.length > 0 && (
        <div className="tp-shop-widget mb-50">
          <h3 className="tp-shop-widget-title">Content Niches</h3>
          <div className="tp-shop-widget-content">
            <div className="tp-shop-widget-checkbox">
              <ul>
                {niches.map((niche) => (
                  <li key={niche}>
                    <div className="tp-shop-widget-checkbox-input">
                      <input 
                        type="checkbox" 
                        id={`niche-${niche.replace(/\s+/g, '-').toLowerCase()}`}
                        checked={filters.niches.includes(niche)}
                        onChange={() => addToArrayFilter('niches', niche)}
                      />
                      <label htmlFor={`niche-${niche.replace(/\s+/g, '-').toLowerCase()}`}>
                        {niche}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Platform Filter */}
      {platforms.length > 0 && (
        <div className="tp-shop-widget mb-50">
          <h3 className="tp-shop-widget-title">Main Platform</h3>
          <div className="tp-shop-widget-content">
            <div className="tp-shop-widget-checkbox">
              <ul>
                {platforms.map((platform) => (
                  <li key={platform}>
                    <div className="tp-shop-widget-checkbox-input">
                      <input 
                        type="checkbox" 
                        id={`platform-${platform.toLowerCase()}`}
                        checked={filters.platforms.includes(platform)}
                        onChange={() => addToArrayFilter('platforms', platform)}
                      />
                      <label htmlFor={`platform-${platform.toLowerCase()}`}>
                        {platform}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Location Filter */}
      {locations.length > 0 && (
        <div className="tp-shop-widget mb-50">
          <h3 className="tp-shop-widget-title">Location</h3>
          <div className="tp-shop-widget-content">
            <div className="tp-shop-widget-checkbox">
              <ul>
                {locations.map((location) => (
                  <li key={location}>
                    <div className="tp-shop-widget-checkbox-input">
                      <input 
                        type="checkbox" 
                        id={`location-${location.replace(/\s+/g, '-').toLowerCase()}`}
                        checked={filters.location.includes(location)}
                        onChange={() => addToArrayFilter('location', location)}
                      />
                      <label htmlFor={`location-${location.replace(/\s+/g, '-').toLowerCase()}`}>
                        {location}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
