import React from "react";
import { Metadata } from "next";
import CartMain from "@/_pages/cart/cart-main";

export const metadata: Metadata = {
  title: "Liko - Cart page",
};

const CartPage = () => {
  return (
    <CartMain/>
  );
};

export default CartPage;
