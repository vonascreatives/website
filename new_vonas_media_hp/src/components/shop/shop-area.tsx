"use client";
import React from "react";
import ShopSidebar from "./sidebar/shop-sidebar";
import CreatorSidebar from "./sidebar/creator-sidebar";
import usePagination from "@/hooks/use-pagination";
import { useCreatorFilters } from "@/hooks/use-creator-filters";
import product_data from "@/data/product-data";
import ShopItem from "./shop-item";
import CreatorItem from "./creator-item";
import Pagination from "../ui/pagination";
import { Filter } from "../svg";
import ProductModal from "../modal/product-modal";
import { IProductDT } from "@/types/product-d-t";
import NiceSelect from "../ui/nice-select";
import "@/styles/creator-filters.css";

interface ShopAreaProps {
  initialCreators?: any[];
}

export default function ShopArea({ initialCreators }: ShopAreaProps) {
  const isShowingCreators = initialCreators && initialCreators.length > 0;
  
  // Use filters for creators, fallback to products
  const {
    filteredCreators,
    isLoading: filtersLoading,
    filters,
    updateFilter,
    addToArrayFilter,
    clearFilters,
    isFilterOpen,
    toggleFilterSidebar,
    hasActiveFilters,
    error
  } = useCreatorFilters(initialCreators || []);
  
  const displayData = isShowingCreators ? filteredCreators : [...product_data];
  const { currentItems, handlePageClick, pageCount } = usePagination(displayData, 9);
  const [productItem, setProductItem] = React.useState<IProductDT | null>(null);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  function handleProductModal (product: IProductDT) {
    setModalOpen(true);
    setProductItem(product);
  };

  const handleSorting = (item: { value: string; label: string }) => {
    updateFilter('sortBy', item.value);
  };
  
  // Different sorting options for creators vs products
  const creatorSortingOptions = [
    { value: "", label: "Default Sorting" },
    { value: "followers-high-to-low", label: "Most Followers" },
    { value: "followers-low-to-high", label: "Least Followers" },
    { value: "recently-added", label: "Recently Added" },
    { value: "alphabetical", label: "A-Z" },
  ];
  
  const productSortingOptions = [
    { value: "", label: "Default Sorting" },
    { value: "low-to-hight", label: "Low to High" },
    { value: "high-to-low", label: "High to Low" },
    { value: "new-added", label: "New Added" },
    { value: "on-sale", label: "On Sale" },
  ];
  
  return (
    <>
      <div className="tp-shop-sidebar-area pb-80">
        <div className="container container-1720">
          <div className="row">
            {/* sidebar area start */}
            <div className="col-xl-2 col-lg-4">
              {isShowingCreators ? (
                <CreatorSidebar 
                  filters={filters}
                  updateFilter={updateFilter}
                  addToArrayFilter={addToArrayFilter}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                  isOpen={isFilterOpen}
                />
              ) : (
                <ShopSidebar />
              )}
            </div>
            {/* sidebar area end */}

            {/* main area start */}
            <div className="col-xl-10 col-lg-8">
              <div className="tp-shop-sidebar-wrap">
                <div className="tp-shop-top mb-45">
                  <div className="row align-items-center">
                    <div className="col-xl-6 col-lg-5 col-md-5">
                      <div className="tp-shop-top-left">
                        <div className="tp-shop-top-result">
                          <p>
                            {filtersLoading && isShowingCreators ? 'Loading...' : 
                            `Showing 1–${Math.min(9, displayData.length)} of ${displayData.length} ${isShowingCreators ? 'creators' : 'results'}`}
                            {hasActiveFilters() && isShowingCreators && (
                              <span className="text-muted ms-2">(filtered)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-7 col-md-7">
                      <div className="tp-shop-top-right d-flex justify-content-start align-items-center justify-content-md-end">
                        <div className="tp-shop-top-select">
                          <NiceSelect
                            options={isShowingCreators ? creatorSortingOptions : productSortingOptions}
                            defaultCurrent={0}
                            onChange={(item) => handleSorting(item)}
                            name="Sorting"
                          />
                        </div>
                        <div className="tp-shop-top-filter">
                          <button
                            type="button"
                            className={`tp-filter-btn filter-open-btn ${isFilterOpen ? 'active' : ''}`}
                            onClick={toggleFilterSidebar}
                          >
                            <span>
                              <Filter />
                            </span>
                            Filter
                            {hasActiveFilters() && isShowingCreators && (
                              <span className="filter-count ms-1">({filters.niches.length + filters.platforms.length + filters.location.length + (filters.followerRange ? 1 : 0)})</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className={`tp-shop-main-wrap ${filtersLoading ? 'loading' : ''}`}>
                      <div className="row">
                        {filtersLoading && isShowingCreators ? (
                          <div className="col-12 text-center py-5">
                            <div className="filter-loading-spinner me-2"></div>
                            Loading creators...
                          </div>
                        ) : (
                          currentItems.map((item) => (
                            <div
                              key={item.id || item._id}
                              className="col-xl-4 col-lg-6 col-md-6"
                            >
                              {isShowingCreators ? (
                                <CreatorItem creator={item} />
                              ) : (
                                <ShopItem product={item} handleProductModal={handleProductModal} />
                              )}
                            </div>
                          ))
                        )}

                        <div className="col-12">
                          <div className="basic-pagination mt-40 text-center">
                            <nav>
                              <Pagination
                                handlePageClick={handlePageClick}
                                pageCount={pageCount}
                              />
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* shop main area end*/}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {isFilterOpen && (
        <div 
          className={`sidebar-overlay ${isFilterOpen ? 'active' : ''}`}
          onClick={toggleFilterSidebar}
        />
      )}
      
      {/* product modal */}
      {productItem && (
        <ProductModal
          showModal={modalOpen}
          setShowModal={setModalOpen}
          productItem={productItem}
          setProductItem={setProductItem}
        />
      )}
      {/* product modal */}
    </>
  );
}
