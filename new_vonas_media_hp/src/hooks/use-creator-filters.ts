"use client";
import { useState, useEffect } from "react";
// Client-side filtering only - no server-side filtering needed

export interface CreatorFilters {
  niches: string[];
  followerRange: string;
  platforms: string[];
  location: string[];
  sortBy: string;
  searchQuery: string;
}

const initialFilters: CreatorFilters = {
  niches: [],
  followerRange: '',
  platforms: [],
  location: [],
  sortBy: '',
  searchQuery: ''
};

export function useCreatorFilters(initialCreators: any[] = []) {
  const [filters, setFilters] = useState<CreatorFilters>(initialFilters);
  const [filteredCreators, setFilteredCreators] = useState<any[]>(initialCreators);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize filtered creators with initial data (client-side filtering happens in main component)
  useEffect(() => {
    setFilteredCreators(initialCreators);
    setIsLoading(false);
  }, [initialCreators]);

  const updateFilter = (key: keyof CreatorFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addToArrayFilter = (key: 'niches' | 'platforms' | 'location', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = () => {
    return filters.niches.length > 0 ||
           filters.followerRange !== '' ||
           filters.platforms.length > 0 ||
           filters.location.length > 0 ||
           filters.searchQuery !== '';
  };

  const toggleFilterSidebar = () => {
    setIsFilterOpen(prev => !prev);
  };

  return {
    filters,
    filteredCreators,
    isLoading,
    isFilterOpen,
    error,
    updateFilter,
    addToArrayFilter,
    clearFilters,
    hasActiveFilters,
    toggleFilterSidebar
  };
}
