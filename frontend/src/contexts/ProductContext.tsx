import { useCallback, useMemo, useState } from "react";
import type { Product } from "../api/product-api";
import { productApi } from "../api/product-api";
import { defaultProductContextProps, ProductContext, type ProductContextProps } from "../hooks/useProduct";

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[] | null>(defaultProductContextProps.products);
    const [isLoading, setIsLoading] = useState<boolean>(defaultProductContextProps.isLoading);

    // Fetch all products
    const fetchAllProducts = useCallback(
        async ({ force }: { force?: boolean } = { force: false }): Promise<Product[]> => {
            if (products && !force) {
                return Promise.resolve(products);
            }
            setIsLoading(true);
            try {
                const fetchedProducts = await productApi.fetchProducts();
                setProducts(fetchedProducts);
                return fetchedProducts;
            } finally {
                setIsLoading(false);
            }
        },
        [products]
    );

    // Fetch one product by ID
    const fetchOneProductById = useCallback(
        async (id: string): Promise<Product> => {
            setIsLoading(true);
            try {
                const product = await productApi.fetchProductById(id);
                return product;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Register a new product
    const registerNewProduct = useCallback(
        async (productData: Omit<Product, 'id'>): Promise<Product> => {
            setIsLoading(true);
            try {
                const newProduct = await productApi.registerProduct(productData);
                console.log("New product registered:", newProduct);
                setProducts((prevProducts) => (prevProducts ? [...prevProducts, newProduct] : [newProduct]));
                return newProduct;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const contextValue: ProductContextProps = useMemo(() => ({
        products,
        isLoading,
        fetchAllProducts,
        fetchOneProductById,
        registerNewProduct
    }), [products, isLoading, fetchAllProducts, fetchOneProductById, registerNewProduct]);

    return (
        <ProductContext value={contextValue}>
            {children}
        </ProductContext>
    );
};
