import { httpClient } from "./http-client";

const BASE_PATH = '/products';

export type QuantityUnit = 'KG' | 'LITERS' | 'UNITS' | 'TONS';
export const QUANTITY_UNITS: QuantityUnit[] = ['KG', 'LITERS', 'UNITS', 'TONS'];


export interface ProductQuantity {
    value: number;
    unit: QuantityUnit;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface ProductOrigin {
    country: string;
    state?: string;
    city?: string;
    coordinates: Coordinates;
}

export type ProductCategory = 'FRUIT' | 'GRAIN' | 'RESOURCE' | 'OIL';
export const PRODUCT_CATEGORIES: ProductCategory[] = ['FRUIT', 'GRAIN', 'RESOURCE', 'OIL'];

export interface Product {
    id: string;
    name: string;
    description?: string;
    category: ProductCategory;
    quantity: ProductQuantity;
    origin: ProductOrigin;
    lot_number?: string;
    carbon_emission?: number;
    metadata?: Record<string, unknown>;
    tags?: string[];
}

export type ProductRegisterData = Omit<Product, 'id'>;

export interface ListAllProductsResponse {
    products: Product[];
}

export interface RegisterProductResponse {
    product: Product;
}

export const productApi = {
    fetchProducts: async (): Promise<Product[]> => {
        const response = await httpClient.get<ListAllProductsResponse>(`${BASE_PATH}/`);
        return response.data.products;
    },
    fetchProductById: async (id: string): Promise<Product> => {
        const response = await httpClient.get<Product>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerProduct: async (productData: ProductRegisterData): Promise<Product> => {
        const response = await httpClient.post<RegisterProductResponse>(`${BASE_PATH}/`, productData);
        return response.data.product;
    }
};
