"use client";
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';

interface Creator {
  _id: string;
  name: string;
  slug: { current: string };
  image?: string;
  imageAlt?: string;
  followers?: number;
}

interface Shortlist {
  sessionId: string;
  creators: Creator[];
  status: string;
}

export function useShortlist() {
  const [shortlist, setShortlist] = useState<Shortlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Generate or get session ID
  useEffect(() => {
    let id = localStorage.getItem('vonas_session_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('vonas_session_id', id);
    }
    setSessionId(id);
  }, []);

  // Helper function to remove duplicates from creators array
  const removeDuplicateCreators = (creators: Creator[]): Creator[] => {
    const seen = new Set<string>();
    return creators.filter(creator => {
      if (seen.has(creator._id)) {
        return false;
      }
      seen.add(creator._id);
      return true;
    });
  };

  // Load shortlist from localStorage on mount
  useEffect(() => {
    if (sessionId) {
      const cached = localStorage.getItem(`vonas_shortlist_${sessionId}`);
      if (cached) {
        try {
          const parsedShortlist = JSON.parse(cached);
          // Remove any duplicates that might exist
          if (parsedShortlist.creators) {
            parsedShortlist.creators = removeDuplicateCreators(parsedShortlist.creators);
            // Save the cleaned version back to localStorage
            localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(parsedShortlist));
          }
          setShortlist(parsedShortlist);
        } catch (error) {
          logger.error('Failed to parse cached shortlist:', error);
        }
      } else {
        // Initialize empty shortlist if none exists
        const emptyShortlist: Shortlist = {
          sessionId,
          creators: [],
          status: 'draft'
        };
        setShortlist(emptyShortlist);
      }
      // Skip server sync for now due to API issues - use localStorage only
      // syncWithServer();
    }
  }, [sessionId]);

  const syncWithServer = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`/api/shortlist?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.shortlist) {
          setShortlist(data.shortlist);
          localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(data.shortlist));
        }
      }
    } catch (error) {
      logger.error('Failed to sync with server:', error);
    }
  }, [sessionId]);

  const addToShortlist = useCallback(async (creator: Creator) => {
    if (!sessionId) return false;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          creatorId: creator._id,
          action: 'add'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.shortlist) {
          setShortlist(data.shortlist);
          localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(data.shortlist));
          return true;
        }
      } else {
        // Fallback to local storage only
        const existingCreators = shortlist?.creators || [];
        const isAlreadyInShortlist = existingCreators.some(c => c._id === creator._id);
        
        if (isAlreadyInShortlist) {
          return true; // Already in shortlist, no need to add
        }
        
        const updatedShortlist: Shortlist = {
          sessionId,
          creators: [...existingCreators, creator],
          status: 'draft'
        };
        setShortlist(updatedShortlist);
        localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(updatedShortlist));
        return true;
      }
    } catch (error) {
      logger.error('Failed to add to shortlist:', error);
      // Fallback to local storage only
      const existingCreators = shortlist?.creators || [];
      const isAlreadyInShortlist = existingCreators.some(c => c._id === creator._id);
      
      if (isAlreadyInShortlist) {
        return true; // Already in shortlist, no need to add
      }
      
      const updatedShortlist: Shortlist = {
        sessionId,
        creators: [...existingCreators, creator],
        status: 'draft'
      };
      setShortlist(updatedShortlist);
      localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(updatedShortlist));
      return true;
    } finally {
      setIsLoading(false);
    }
    return false;
  }, [sessionId, shortlist]);

  const removeFromShortlist = useCallback(async (creatorId: string) => {
    if (!sessionId) return false;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          creatorId,
          action: 'remove'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.shortlist) {
          setShortlist(data.shortlist);
          localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(data.shortlist));
          return true;
        }
      } else {
        // Fallback to local storage only
        const updatedShortlist: Shortlist = {
          sessionId,
          creators: (shortlist?.creators || []).filter(c => c._id !== creatorId),
          status: 'draft'
        };
        setShortlist(updatedShortlist);
        localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(updatedShortlist));
        return true;
      }
    } catch (error) {
      logger.error('Failed to remove from shortlist:', error);
      // Fallback to local storage only
      const updatedShortlist: Shortlist = {
        sessionId,
        creators: (shortlist?.creators || []).filter(c => c._id !== creatorId),
        status: 'draft'
      };
      setShortlist(updatedShortlist);
      localStorage.setItem(`vonas_shortlist_${sessionId}`, JSON.stringify(updatedShortlist));
      return true;
    } finally {
      setIsLoading(false);
    }
    return false;
  }, [sessionId, shortlist]);

  const toggleShortlist = useCallback(async (creator: Creator) => {
    const isCurrentlyInShortlist = shortlist?.creators?.some(c => c._id === creator._id) || false;
    
    if (isCurrentlyInShortlist) {
      return await removeFromShortlist(creator._id);
    } else {
      return await addToShortlist(creator);
    }
  }, [shortlist, addToShortlist, removeFromShortlist]);

  const isInShortlist = useCallback((creatorId: string): boolean => {
    return shortlist?.creators?.some(c => c._id === creatorId) || false;
  }, [shortlist]);

  const getShortlistCount = useCallback((): number => {
    return shortlist?.creators?.length || 0;
  }, [shortlist]);

  return {
    shortlist,
    sessionId,
    isLoading,
    addToShortlist,
    removeFromShortlist,
    toggleShortlist,
    isInShortlist,
    getShortlistCount,
    syncWithServer,
  };
}
