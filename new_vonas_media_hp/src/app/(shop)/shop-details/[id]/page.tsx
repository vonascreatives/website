import { Metadata } from "next";
import product_data from "@/data/product-data";
import ShopDetailsMain from "@/pages/shop/shop-details-main";

export const metadata: Metadata = {
  title: "Liko - Shop Details page",
};

export default async function ShopDetailsPage({params}:{params:Promise<{id:string}>}) {
  const { id } = await params;
  const product = [...product_data].find((p) => p.id === Number(id));
  return product ? (
    <ShopDetailsMain product={product} />
  ) : (
    <div className="text-center pt-100">
      Product not found with id: {id}
    </div>
  );
}
