"use client";
import { createContext, useCallback, useContext, useMemo } from "react";
import { IProduct, IProductContextProps, IProductStock } from "../models";
import { ApiResponse, useAPI } from "../hooks";

export const ProductContext = createContext({} as IProductContextProps);

export function ProductProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { httpGET, httpPOST, httpPATCH, httpDELETE } = useAPI();

  const createProductByEstablishment = useCallback(
    async (productData: Partial<IProduct>): Promise<ApiResponse<IProduct>> => {
      return await httpPOST<IProduct>("/product/establishment", {
        method: "POST",
        body: productData,
      });
    },
    [httpPOST]
  );

  const getProductsByEstablishment = useCallback(
    async (establishmentId: string): Promise<ApiResponse<IProduct[]>> => {
      return await httpGET<IProduct[]>(
        `/product/establishment/${establishmentId}`
      );
    },
    [httpGET]
  );

  const getProductById = useCallback(
    async (productId: string): Promise<ApiResponse<IProduct>> => {
      return await httpGET<IProduct>(`/product/${productId}`);
    },
    [httpGET]
  );

  const increaseQuantityProduct = useCallback(
    async (
      productId: string,
      establishmentId: string,
      quantity: number
    ): Promise<ApiResponse<IProductStock>> => {
      return await httpPATCH<IProductStock>(
        `/product/${productId}/establishment/${establishmentId}`,
        {
          method: "PATCH",
          body: { quantity },
        }
      );
    },
    [httpPATCH]
  );

  const updateProductByEstablishment = useCallback(
    async (
      productId: string,
      establishmentId: string,
      productData: Partial<IProduct>
    ): Promise<ApiResponse<IProduct>> => {
      return await httpPATCH<IProduct>(
        `/product/${productId}/establishment/${establishmentId}`,
        {
          method: "PATCH",
          body: productData,
        }
      );
    },
    [httpPATCH]
  );

  const removeProductByEstablishment = useCallback(
    async (
      productId: string,
      establishmentId: string
    ): Promise<ApiResponse<null>> => {
      return await httpDELETE<null>(
        `/product/${productId}/establishment/${establishmentId}`
      );
    },
    [httpDELETE]
  );

  const values = useMemo(() => {
    return {
      createProductByEstablishment,
      getProductsByEstablishment,
      getProductById,
      increaseQuantityProduct,
      updateProductByEstablishment,
      removeProductByEstablishment,
    };
  }, [
    createProductByEstablishment,
    getProductsByEstablishment,
    getProductById,
    increaseQuantityProduct,
    updateProductByEstablishment,
    removeProductByEstablishment,
  ]);

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
}

export default ProductContext;

export const useProduct = () => useContext(ProductContext);
