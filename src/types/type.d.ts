import { Product as PrismaProduct, Review as PrismaReview, UserRole, User, ReviewMedia, ProductMedia } from "@prisma/client";

export interface UserType {
    id: string;
    email: string;
    password: string;
    name: string | null;
    role: UserRole;
    image: string | null;
    created_at: Date;
}

export interface LoginResponseInterface {
    user: UserType,
    access_token: string
    refresh_token: string
}

export interface CategoryType {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export interface ImageType {
    id: string;
    url: string;
    product_id: string;
}

export interface ProductType {
    id: number;
    name: string;
    price: string;
    images: string[];
    rating: number;
    is_featured: boolean;
    category_id: number;
    description: string;
    reviews: {
        username: string;
        rating: number;
        comment: string;
    }[];

}



export interface ProductType2 {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
    images: ImageType[];
    category: CategoryType | null;
    created_at: Date;
    updated_at: Date;
}

export interface AddressType {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    created_at: Date;
    updated_at: Date;
}

export interface CuponType {
    id: string;
    code: string;
    description: string;
    discount_percent: number;
    active: boolean;
    valid_from: Date;
    valid_until: Date;
    created_at: Date;
    updated_at: Date;
}

export interface OrderType {
    id: string;
    order_items: {
        quantity: number;
        product_id: string;
        order_id: string;
    }[];
    user_id: string;
    address_id: string;
    cupon_id?: string;
    created_at: Date;
    updated_at: Date;
}


export interface TableDataType<T> {
    data: T[];
    totalCounts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number;
    previousPage: number;
}

export interface DataTableQueryProps {
    search?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    limit?: number;
    page?: number;
    onlyPublished?: boolean;
    featured?: boolean;
}



export type Product = PrismaProduct & {
    images: ProductMedia[];
};

export type Review = PrismaReview & { product: Product, user: User, images: ReviewMedia[] }

export type CartItem = {
    id: string
    name: string
    category: string
    price: number
    image: string
    quantity: number
}

export interface OrderAddress {
    full_address: string
    save: boolean
    new: boolean
}

export interface OrderDetails {
    id: string;
    created_at: Date;
    status: OrderStatus;
    updated_at: Date;
    address: string;
    total_amount: number;
    user_id: string;
    user_phone: string;
    order_items: OrderItem[];
    user: User;
}