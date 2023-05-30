// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { createContext, useEffect, useState } from "react";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { useTypedSelector } from "../../hooks/useTypedSelector";

type ProductSearchContextType = {
  searchInSavedProducts: (term?: string, barCode?: string) => IProduct[];
  products: IProduct[];
};

export const ProductSearchContext = createContext<ProductSearchContextType>({
  searchInSavedProducts: (term?: string, barCode?: string) => [],
  products: [],
});

export function ProductSearchContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { savedProducts } = useTypedSelector((state) => state.savedProducts);
  const [products, setProducts] = useState(Array.from(savedProducts.values()));
  useEffect(() => {
    setProducts(Array.from(savedProducts.values()));
  }, [savedProducts]);

  const searchInSavedProducts = (
    term?: string,
    barCode?: string
  ): IProduct[] => {
    if (typeof term === "string") {
      return products.filter((product: IProduct) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (typeof barCode === "string") {
      return products.filter(
        (product: IProduct) => product.barCode === barCode
      );
    }

    return [];
  };

  return (
    <ProductSearchContext.Provider value={{ searchInSavedProducts, products }}>
      {children}
    </ProductSearchContext.Provider>
  );
}
