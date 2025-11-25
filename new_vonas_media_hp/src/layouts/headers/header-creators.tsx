'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeaderMenus from './header-menus';
import useSticky from '@/hooks/use-sticky';
import { Menu, Search, Wishlist, Zero } from '@/components/svg';
import logo_1 from '@/assets/img/logo/logo.png';
import logo_2 from '@/assets/img/logo/logo-white.png';
import { useShortlist } from '@/hooks/use-shortlist';
import { MobileOffcanvas } from '@/components/offcanvas/unified-mobile-offcanvas';
import ShortlistOffcanvas from '@/components/offcanvas/shortlist-offcanvas';

export default function HeaderCreators() {
  const {sticky,headerFullWidth} = useSticky();
  const [openShortlistMini, setOpenShortlistMini] = React.useState(false);
  const [openOffCanvas, setOpenOffcanvas] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const { shortlist } = useShortlist();
  const shortlistCount = shortlist?.creators?.length || 0;
  const router = useRouter();

  useEffect(() => {
    headerFullWidth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/creators?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      router.push(`/creators?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <>
      <header className="tp-header-height z-index-5">
        <div className="tp-inner-header-2-area tp-shop-mob-space tp-transparent tp-inner-header-2-bg">
          <div className="container container-1800">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-4 col-md-4 col-4">
                <div className="tp-header-logo">
                  <Link className="logo-1" href="/">
                    <Image src={logo_1} alt="logo" />
                  </Link>
                  <Link className="logo-2" href="/">
                    <Image src={logo_2} alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-5 d-none d-xl-block">
                <div className="tp-inner-header-2-menu header-main-menu">
                  <nav className="tp-main-menu-content">
                    {/* header menus */}
                    <HeaderMenus />
                    {/* header menus */}
                  </nav>
                </div>
              </div>
              <div className="col-xl-5 col-lg-8 col-md-8 col-8">
                <div className="tp-inner-header-2-right d-flex align-items-center justify-content-end">
                  <form onSubmit={handleSearch} className="tp-inner-header-2-search p-relative d-none d-lg-block">
                    <input
                      type="text"
                      placeholder="Search creators..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span
                      onClick={handleSearchIconClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <Search/>
                    </span>
                  </form>
                  {/* Mobile search: toggle an inline input when the button is pressed */}
                  {mobileSearchOpen ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) router.push(`/creators?search=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="tp-inner-header-2-search p-relative d-block d-lg-none"
                    >
                      <input
                        type="text"
                        placeholder="Search creators..."
                        value={searchQuery}
                        autoFocus
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingRight: '40px' }}
                      />
                      <span
                        onClick={() => { if (searchQuery.trim()) router.push(`/creators?search=${encodeURIComponent(searchQuery.trim())}`); }}
                        style={{ cursor: 'pointer', position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                        aria-label="Search"
                      >
                        <Search/>
                      </span>
                      <button
                        type="button"
                        aria-label="Close search"
                        onClick={() => setMobileSearchOpen(false)}
                        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
                      >
                        Close
                      </button>
                    </form>
                  ) : (
                    <button className="tp-shop-mob-search d-lg-none" onClick={() => setMobileSearchOpen(true)}>
                      <span>
                        <Search/>
                      </span>
                    </button>
                  )}
                  <button onClick={() => setOpenShortlistMini(true)} className="tp-inner-header-2-wishlist p-relative">
                    {shortlistCount > 0 && <i>{shortlistCount}</i>}
                    <span>
                      <Wishlist/>
                    </span>
                  </button>
                  <button onClick={()=> setOpenOffcanvas(true)} className="tp-inner-header-2-bar tp-offcanvas-open-btn">
                    <span>
                      <Menu/>
                    </span>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* shortlist mini */}
      <ShortlistOffcanvas openShortlistMini={openShortlistMini} setOpenShortlistMini={setOpenShortlistMini} />
      {/* shortlist mini */}

      {/* off canvas */}
      <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffcanvas} />
      {/* off canvas */}
    </>
  )
}
