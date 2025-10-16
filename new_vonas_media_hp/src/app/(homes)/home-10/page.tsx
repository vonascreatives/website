import React from 'react';
import { Metadata } from 'next';
import HomeTenMain from '@/_pages/homes/home-10';

export const metadata: Metadata = {
  title: "Liko - Home Ten Page",
};

const HomePageTen = () => {
  return (
    <HomeTenMain/>
  );
};

export default HomePageTen;
