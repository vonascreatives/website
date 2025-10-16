import React from 'react';
import { Metadata } from 'next';
import HomeNineMain from '@/_pages/homes/home-9';

export const metadata: Metadata = {
  title: "Liko - Home Nine Page",
};

const HomePageNine = () => {
  return (
    <HomeNineMain/>
  );
};

export default HomePageNine;
