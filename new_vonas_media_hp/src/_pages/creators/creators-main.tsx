"use client";
import React from "react";
import Wrapper from "@/layouts/wrapper";
import HeaderCreators from "@/layouts/headers/header-creators";
import FooterOne from "@/layouts/footers/footer-one";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import CreatorSidebar from "@/components/shop/sidebar/creator-sidebar";
import CreatorItem from "@/components/shop/creator-item";
import NiceSelect from "@/components/ui/nice-select";
import { useCreatorFilters } from "@/hooks/use-creator-filters";
import { getCreatorFollowerCount } from "@/utils/formatFollowers";

// Type definitions
type Creator = {
  _id: string;
  name: string;
  slug: { current: string } | string;
  image?: string;
  imageAlt?: string;
  followers?: number | string;
  totalFollowers?: number | string;
  subscribers?: number | string;
  mainCategory?: string;
  niche?: string;
  niches?: string[];
  mainPlatform?: string;
  location?: string;
  verified?: boolean;
  featured?: boolean;
  availability?: {
    status: string;
    responseTime?: string;
  };
  socialLinks?: Array<{
    platform: string;
    url: string;
    handle: string;
  }>;
  metrics?: {
    engagementRate?: number;
    averageViews?: number;
    collaborations?: number;
  };
};

type CreatorsMainProps = {
  initialCreators?: Creator[];
  filterOptions?: {
    categories: string[];
    locations: string[];
    platforms: string[];
  };
};

export default function CreatorsMain({ 
  initialCreators = [], 
  filterOptions = { categories: [], locations: [], platforms: [] }
}: CreatorsMainProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const creatorsPerPage = 9;

  const {
    filters,
    filteredCreators,
    isLoading,
    error,
    updateFilter,
    addToArrayFilter,
    clearFilters,
    hasActiveFilters,
    isFilterOpen,
    toggleFilterSidebar,
  } = useCreatorFilters(initialCreators);

  // Helper function to get follower count
  const getFollowerCount = React.useCallback((creator: Creator): number => {
    return getCreatorFollowerCount(creator);
  }, []);

  // Client-side filtering logic
  const applyClientSideFiltering = React.useMemo(() => {
    let filtered = [...(filteredCreators.length > 0 ? filteredCreators : initialCreators)];
    
    // Apply filters based on CMS data structure
    
    // Niche/Category filtering - match against mainCategory and niches array
    if (filters.niches.length > 0) {
      filtered = filtered.filter(creator => {
        const mainCat = creator.mainCategory || '';
        const niches = creator.niches || [];
        
        return filters.niches.some(filterNiche => {
          // Convert filter niche to match data format
          const filterSlug = filterNiche.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '&');
          return mainCat.includes(filterSlug) || niches.some((n: string) => n.includes(filterSlug));
        });
      });
    }
    
    // Location filtering
    if (filters.location.length > 0) {
      filtered = filtered.filter(creator => {
        return filters.location.includes(creator.location);
      });
    }
    
    // Platform filtering - currently most platforms are null, so skip for now
    if (filters.platforms.length > 0) {
      filtered = filtered.filter(creator => {
        return creator.mainPlatform && filters.platforms.includes(creator.mainPlatform);
      });
    }
    
    // Follower range filtering - use the followers display string
    if (filters.followerRange) {
      filtered = filtered.filter(creator => {
        const followerStr = creator.followers || '';
        const followerNum = getFollowerCount(creator);
        
        switch (filters.followerRange) {
          case '1k-10k':
            return followerNum >= 1000 && followerNum < 10000;
          case '10k-50k':
            return followerNum >= 10000 && followerNum < 50000;
          case '50k-100k':
            return followerNum >= 50000 && followerNum < 100000;
          case '100k-500k':
            return followerNum >= 100000 && followerNum < 500000;
          case '500k-1m':
            return followerNum >= 500000 && followerNum < 1000000;
          case '1m+':
            return followerNum >= 1000000;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'followers-high-to-low':
          filtered.sort((a, b) => {
            const aFollowers = getFollowerCount(a);
            const bFollowers = getFollowerCount(b);
            return bFollowers - aFollowers;
          });
          break;
        case 'followers-low-to-high':
          filtered.sort((a, b) => {
            const aFollowers = getFollowerCount(a);
            const bFollowers = getFollowerCount(b);
            return aFollowers - bFollowers;
          });
          break;
        case 'alphabetical':
          filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'recently-added':
          // Keep default order (most recently added first)
          break;
        default:
          break;
      }
    }
    
    return filtered;
  }, [filteredCreators, initialCreators, filters, getFollowerCount]);

  // Use the processed filtered creators for display
  const finalCreators = applyClientSideFiltering;
  
  // Pagination
  const totalPages = Math.ceil(finalCreators.length / creatorsPerPage);
  const startIndex = (currentPage - 1) * creatorsPerPage;
  const endIndex = startIndex + creatorsPerPage;
  const currentCreators = finalCreators.slice(startIndex, endIndex);

  // Sorting options
  const sortingOptions = [
    { value: "", label: "Default Sorting" },
    { value: "followers-high-to-low", label: "Most Followers" },
    { value: "followers-low-to-high", label: "Least Followers" },
    { value: "recently-added", label: "Recently Added" },
    { value: "alphabetical", label: "A-Z" },
  ];

  const handleSortChange = (item: { value: string; label: string }) => {
    updateFilter("sortBy", item.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    const resultsSection = document.querySelector('.tp-shop-top');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderCreators />
      {/* header area end */}
      
      <Breadcrumb title="Premium Content Creators" subtitle="Premium Content Creators" />
      
      {/* Main Content Area */}
      <div className="tp-shop-sidebar-area pb-80">
        <div className="container container-1720">
          <div className="row">
            
            {/* Sidebar */}
            <div className="col-xl-2 col-lg-4">
              <CreatorSidebar
                filters={filters}
                updateFilter={updateFilter}
                addToArrayFilter={addToArrayFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                isOpen={isFilterOpen}
                filterOptions={filterOptions}
              />
            </div>

            {/* Main Content */}
            <div className="col-xl-10 col-lg-8">
              <div className="tp-shop-sidebar-wrap">
                
                {/* Top Bar */}
                <div className="tp-shop-top mb-45">
                  <div className="row align-items-center">
                    
                    {/* Results Count */}
                    <div className="col-xl-6 col-lg-5 col-md-5">
                      <div className="tp-shop-top-left">
                        <div className="tp-shop-top-result">
                          <p>
                            Showing {Math.min(startIndex + 1, finalCreators.length)}–{Math.min(endIndex, finalCreators.length)} of {finalCreators.length} content creators
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sorting and Filter Button */}
                    <div className="col-xl-6 col-lg-7 col-md-7">
                      <div className="tp-shop-top-right d-flex justify-content-start align-items-center justify-content-md-end">
                        
                        {/* Sorting Dropdown */}
                        <div className="tp-shop-top-select">
                          <NiceSelect
                            options={sortingOptions}
                            defaultCurrent={sortingOptions.findIndex(option => option.value === filters.sortBy)}
                            onChange={handleSortChange}
                            name="SortingSelect"
                          />
                        </div>

                        {/* Mobile Filter Button */}
                        <div className="tp-shop-top-filter">
                          <button
                            type="button"
                            className={`tp-filter-btn filter-open-btn ${isFilterOpen ? 'active' : ''}`}
                            onClick={toggleFilterSidebar}
                          >
                            <span>
                              <svg width="16" height="15" viewBox="0 0 16 15" fill="none">
                                <path d="M14.9998 3.45001H10.7998" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3.8 3.45001H1" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6.5999 5.9C7.953 5.9 9.0499 4.8031 9.0499 3.45C9.0499 2.0969 7.953 1 6.5999 1C5.2468 1 4.1499 2.0969 4.1499 3.45C4.1499 4.8031 5.2468 5.9 6.5999 5.9Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15.0002 11.15H12.2002" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5.2 11.15H1" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9.4002 13.6C10.7533 13.6 11.8502 12.5031 11.8502 11.15C11.8502 9.79691 10.7533 8.70001 9.4002 8.70001C8.0471 8.70001 6.9502 9.79691 6.9502 11.15C6.9502 12.5031 8.0471 13.6 9.4002 13.6Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creators Grid */}
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-shop-main-wrap">
                      <div className="row">
                        {isLoading ? (
                          // Loading state
                          <div className="col-12 text-center py-5">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading creators...</p>
                          </div>
                        ) : error ? (
                          // Error state
                          <div className="col-12 text-center py-5">
                            <div className="tp-shop-no-result">
                              <h4 className="text-danger">Error Loading Creators</h4>
                              <p>{error}</p>
                              <button 
                                className="tp-btn-cart mt-3" 
                                onClick={() => window.location.reload()}
                              >
                                Reload Page
                              </button>
                            </div>
                          </div>
                        ) : currentCreators.length > 0 ? (
                          // Creators grid
                          currentCreators.map((creator) => {
                            if (!creator || !creator._id) {
                              console.warn('Invalid creator data:', creator);
                              return null;
                            }
                            return (
                              <div key={creator._id} className="col-xl-4 col-lg-6 col-md-6">
                                <CreatorItem creator={creator} />
                              </div>
                            );
                          }).filter(Boolean)
                        ) : (
                          // No results state
                          <div className="col-12 text-center py-5">
                            <div className="tp-shop-no-result">
                              <h4>No content creators found</h4>
                              <p>Try adjusting your filters to find the perfect creators for your brand.</p>
                              {hasActiveFilters() && (
                                <button 
                                  className="tp-btn-cart mt-3" 
                                  onClick={clearFilters}
                                >
                                  Clear All Filters
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Pagination */}
                        {!isLoading && finalCreators.length > creatorsPerPage && (
                          <div className="col-12">
                            <div className="basic-pagination mt-40 text-center">
                              <nav>
                                <ul className="pagination list-wrap" role="navigation" aria-label="Pagination">
                                  
                                  {/* Previous Button */}
                                  <li className={`previous ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <a
                                      className={currentPage === 1 ? 'disabled' : ''}
                                      tabIndex={currentPage === 1 ? -1 : 0}
                                      role="button"
                                      aria-disabled={currentPage === 1}
                                      aria-label="Previous page"
                                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    >
                                      <i className="fa-regular fa-arrow-left icon"></i>
                                    </a>
                                  </li>

                                  {/* Page Numbers */}
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <li key={page} className={currentPage === page ? 'current' : ''}>
                                      <button
                                        type="button"
                                        aria-label={currentPage === page ? `Page ${page} is your current page` : `Go to page ${page}`}
                                        aria-current={currentPage === page ? 'page' : undefined}
                                        onClick={() => handlePageChange(page)}
                                        style={{ 
                                          cursor: 'pointer',
                                          background: 'none',
                                          border: 'none',
                                          padding: '8px 12px',
                                          color: 'inherit'
                                        }}
                                      >
                                        {page}
                                      </button>
                                    </li>
                                  ))}

                                  {/* Next Button */}
                                  <li className={`next ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <a
                                      className={currentPage === totalPages ? 'disabled' : ''}
                                      tabIndex={currentPage === totalPages ? -1 : 0}
                                      role="button"
                                      aria-disabled={currentPage === totalPages}
                                      aria-label="Next page"
                                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    >
                                      <i className="fa-regular fa-arrow-right icon"></i>
                                    </a>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* footer area start */}
      <FooterOne />
      {/* footer area end */}
    </Wrapper>
  );
}
