'use client';
import React from 'react';
import Link from 'next/link';
import { Wishlist } from '@/components/svg';
import { useShortlist } from '@/hooks/use-shortlist';

type ShortlistButtonProps = {
  variant?: 'button' | 'link';
  className?: string;
  onClick?: () => void;
  showCounter?: boolean;
  iconType?: 'svg' | 'wishlist-component';
};

const ShortlistButton: React.FC<ShortlistButtonProps> = ({
  variant = 'button',
  className = '',
  onClick,
  showCounter = true,
  iconType = 'wishlist-component'
}) => {
  const { getShortlistCount } = useShortlist();
  const shortlistCount = getShortlistCount();

  const renderIcon = () => {
    if (iconType === 'svg') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      );
    }
    return (
      <span>
        <Wishlist />
      </span>
    );
  };

  const renderCounter = () => {
    if (!showCounter || shortlistCount === 0) return null;
    
    if (iconType === 'svg') {
      return (
        <span 
          style={{ 
            background: '#ff6b6b',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '600'
          }}
        >
          {shortlistCount}
        </span>
      );
    }
    
    return <i>{shortlistCount}</i>;
  };

  if (variant === 'link') {
    return (
      <Link 
        href="/shortlist" 
        className={`tp-header-shortlist p-relative d-none d-sm-block ${className}`}
        style={iconType === 'svg' ? { 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: 'inherit',
          textDecoration: 'none',
          marginRight: '20px'
        } : undefined}
      >
        {renderIcon()}
        {renderCounter()}
      </Link>
    );
  }

  return (
    <button
      className={`p-relative ${className}`}
      onClick={onClick}
    >
      {renderCounter()}
      {renderIcon()}
    </button>
  );
};

export default ShortlistButton;
