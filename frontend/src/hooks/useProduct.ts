import { createContext, use } from "react";
import type { Product } from "../api/product-api";

export interface ProductContextProps {
    // State
    products: Product[] | null;
    isLoading: boolean;

    // Actions
    fetchAllProducts: () => Promise<Product[]>;
    fetchOneProductById: (id: string) => Promise<Product>;
    registerNewProduct: (productData: Omit<Product, 'id'>) => Promise<Product>;
};

export const defaultProductContextProps: ProductContextProps = {
    products: null,
    isLoading: false,
    fetchAllProducts: async () => { throw new Error('fetchAllProducts not implemented'); },
    fetchOneProductById: async () => { throw new Error('fetchOneProductById not implemented'); },
    registerNewProduct: async () => { throw new Error('registerNewProduct not implemented'); },
};

export const ProductContext = createContext<ProductContextProps>(defaultProductContextProps);

export const useProductContext = () => use(ProductContext);
