'use server'

import { TableDataType, DataTableQueryProps, CartItem, OrderAddress } from "@/types/type";
import ApiResponse, { ApiResponseType } from "./ApiResponse";
import AsyncHandler from "./AsyncHandler";
import { z } from "zod";
import { CategorySchema, LoginSchema, ProductSchema, SignupSchema, SliderContentSchema } from "./schema";
import { db } from "@/db";
import wait, { comparePassword, hashPassword } from "./utils";
import { auth, signIn, signOut } from "@/auth";
import { Category, Order, OrderItem, OrderStatus, Product, PublishStatus, Review, SliderContent, User, UserRole } from "@prisma/client";
import { products } from "./product-seed";
import { DEFAUTL_AUTH_REDIRECT } from "@/routes";

export const getAuthUser = AsyncHandler(async (checkRole: UserRole[] = [], include?: { [key: string]: boolean }): Promise<ApiResponseType<Partial<User> | null>> => {
    const session = await auth();
    if (!session) return ApiResponse(401, "Unauthorized");
    console.log(include)

    const user = await db.user.findFirst({
        where: {
            email: session?.user?.email!,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
            ...include,
            password: false,
        }
    })

    if (checkRole.length > 0 && !checkRole.includes(user?.role!)) return ApiResponse(403, "Forbidden");
    return ApiResponse(200, "User found", user)
})

export const updateUser = AsyncHandler(async (id: string, data: Partial<User>): Promise<ApiResponseType<null>> => {
    const currentUser = await getAuthUser([UserRole.ADMIN]);
    if (!currentUser.success) return ApiResponse(403, "Forbidden");

    const existUser = await db.user.findUnique({
        where: { id },
    });
    if (!existUser) return ApiResponse(404, "User not found");

    if (data.password) {
        data.password = await hashPassword(data.password);
    }

    await db.user.update({
        where: { id },
        data,
    });

    return ApiResponse(200, "User updated successfully");
});

export const login = async (credentials: z.infer<typeof LoginSchema>, callback: string = DEFAUTL_AUTH_REDIRECT): Promise<ApiResponseType<User | undefined>> => {
    const validateFields = LoginSchema.safeParse(credentials)

    if (!validateFields.success) return ApiResponse(400, "Invalid Credentials")

    const { email, password } = validateFields.data

    const user = await db.user.findFirst({
        where: {
            email
        }
    })
    if (!user) return ApiResponse(400, "User not found");

    if (!(await comparePassword(credentials.password, user.password))) return ApiResponse(400, "Invalid password");
    try {
        await signIn(
            "credentials",
            {
                email: email,
                password: password,
                redirect: false,
            },
        );

        return ApiResponse(200, "Login successful");
    } catch (error) {
        console.log({ LoginError: error })
        throw error
    }
}

export const signup = AsyncHandler(async (values: z.infer<typeof SignupSchema>): Promise<ApiResponseType<User | undefined>> => {
    const existUser = await db.user.findFirst({
        where: {
            email: values.email
        }
    })
    if (existUser) return ApiResponse(400, "User already exists");

    const newUser = await db.user.create({
        data: {
            email: values.email,
            name: values.name,
            password: await hashPassword(values.password),
            phone: values.phone,
        }
    })

    await db.address.create({
        data: {
            user_id: newUser.id,
            full_address: values.address
        }
    })

    return ApiResponse(200, "User created successfully", newUser)
})


export const getCategories = AsyncHandler(async (
    query: DataTableQueryProps,
): Promise<ApiResponseType<TableDataType<Partial<Category>> | null>> => {
    // await wait(1000); // FIXME: Remove this line

    const search = query?.search ?? null;
    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);
    const onlyPublished = query?.onlyPublished ?? true;
    const featured = query?.featured ?? false;

    const currentUser = await getAuthUser();

    // Search functionality
    let whereClause = {};
    if (search) {
        whereClause = {
            name: {
                contains: search,
                mode: "insensitive", // Case-insensitive search
            },
        };
    }

    if (onlyPublished) {
        whereClause = {
            ...whereClause,
            status: "ACTIVE",
        };
    }
    else if (!currentUser.success || currentUser.data.role !== "ADMIN") return ApiResponse(403, "Forbidden");

    if (featured) {
        whereClause = {
            ...whereClause,
            is_featured: true,
        };
    }

    // Sorting functionality
    const orderByClause = {
        [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
    };

    // Pagination calculations
    const offset = (page - 1) * limit;

    // Fetch data from the database
    const [categories, total_count] = await Promise.all([
        db.category.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: offset,
            take: Number(limit),
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                status: true,
                is_featured: true,
                products: true,
                created_at: true,
                updated_at: true,
            },
        }),
        db.category.count({
            where: whereClause,
        }),
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Build the response structure
    const response_data: TableDataType<Partial<Category>> = {
        data: categories,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Categories retrieved successfully", response_data);
});

export const getCategory = AsyncHandler(async (id: string): Promise<ApiResponseType<Category | null>> => {
    // await wait(1000); // FIXME: Remove this line
    const category = await db.category.findUnique({
        where: {
            id
        }
    })

    if (!category) return ApiResponse(404, "Category not found");

    return ApiResponse(200, "Category found", category)
})

export const createCategory = AsyncHandler(async (category: z.infer<typeof CategorySchema>): Promise<ApiResponseType<null>> => {
    const currentUser = await getAuthUser([UserRole.ADMIN]);
    if (!currentUser.success) return ApiResponse(403, "Forbidden");

    const existCategory = await db.category.findFirst({
        where: {
            name: category.name
        }
    });
    if (existCategory) return ApiResponse(400, "Category already exists");

    await db.category.create({
        data: category
    })

    return ApiResponse(200, "Category created successfully")
});

export const updateCategory = AsyncHandler(async (id: string, category: z.infer<typeof CategorySchema>): Promise<ApiResponseType<null>> => {
    const existCategory = await db.category.findFirst({
        where: {
            name: category.name,
            NOT: {
                id: id
            }
        }
    });
    if (existCategory) return ApiResponse(400, "Category name already exists");

    await db.category.update({
        where: {
            id
        },
        data: category
    })

    return ApiResponse(200, "Category updated successfully")
})

export const deleteCategory = AsyncHandler(async (id: string): Promise<ApiResponseType<null>> => {
    await db.category.delete({
        where: {
            id
        }
    })

    return ApiResponse(200, "Category deleted successfully")
})


export const getProducts = AsyncHandler(async (query: DataTableQueryProps & { categories?: string[], minPrice?: number, maxPrice?: number }, include?: { [key: string]: boolean | { [key: string]: boolean } }): Promise<ApiResponseType<TableDataType<Partial<Product>> | null>> => {
    // await wait(1000); // FIXME: Remove this line

    const search = query?.search ?? null;
    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);
    const onlyPublished = query?.onlyPublished ?? true;
    const featured = query?.featured ?? false;

    const minPrice = query?.minPrice ?? 0;
    const maxPrice = query?.maxPrice

    const categories = query?.categories ?? null;

    console.log({ sort_by, sort_order, limit, page, onlyPublished, featured, categories, minPrice, maxPrice })

    include = {
        ...include,
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        status: true,
        is_featured: true,
        category_name: true,
        created_at: true,
        updated_at: true,
    }

    if ('seller' in include) {
        include = {
            ...include,
            seller: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        }
    }

    // console.log({search, sort_by, sort_order, limit, page, onlyPublished, featured})

    // Search functionality
    let whereClause = {};

    if (categories) {
        whereClause = {
            category_name: {
                in: categories
            }
        }
    }

    if (minPrice || maxPrice) {
        whereClause = {
            ...whereClause,
            price: {
                ...(minPrice && { gte: minPrice }),
                ...(maxPrice && { lte: maxPrice }),
            }
        }
    }

    if (search) {
        whereClause = {
            name: {
                contains: search,
                mode: "insensitive", // Case-insensitive search
            },
        };
    }

    if (onlyPublished) {
        whereClause = {
            ...whereClause,
            status: "ACTIVE",
        };
    } else {
        whereClause = {
            ...whereClause,
            seller_email: (await getAuthUser()).data.email
        };
    }

    if (featured) {
        whereClause = {
            ...whereClause,
            is_featured: true,
        };
    }

    // Sorting functionality
    const orderByClause = {
        [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
    };

    // Pagination calculations
    const offset = (page - 1) * limit;

    // Fetch data from the database
    const [products, total_count] = await Promise.all([
        db.product.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: offset,
            take: Number(limit),
            select: include,
        }),
        db.product.count({
            where: whereClause,
        }),
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Build the response structure
    const response_data: TableDataType<Partial<Product>> = {
        data: products,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Products retrieved successfully", response_data);
});

export const getProduct = AsyncHandler(async (id: string, include?: { [key: string]: boolean | { select: { [key: string]: boolean } } }): Promise<ApiResponseType<Partial<Product & { seller: Partial<User> }> | null>> => {
    include = {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        status: true,
        is_featured: true,
        category_name: true,
        created_at: true,
        updated_at: true,
        reviews: true,
        ...include,
    }

    if ('seller' in include) {
        include = {
            ...include,
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                }
            },
        }
    }

    const product = await db.product.findUnique({
        where: {
            id
        },
        select: {
            ...include,
        },
    })

    if (!product) return ApiResponse(404, "Product not found");

    return ApiResponse(200, "Product found", product)
})

export const createProduct = AsyncHandler(async (product: z.infer<typeof ProductSchema> & { images: string[] }): Promise<ApiResponseType<null>> => {
    const user = await getAuthUser();

    if (user.data.role !== UserRole.ADMIN) {
        if (product.is_featured) {
            const featuredProductsCount = await db.product.count({
                where: {
                    seller_email: user.data.email,
                    is_featured: true,
                },
            });

            if (featuredProductsCount >= 5) {
                return ApiResponse(400, "You can only have a maximum of 5 featured products.");
            }
        }
    }

    await db.product.create({
        data: {
            ...product,
            seller_email: user.data.email,
            images: {
                createMany: {
                    data: product.images.map((image: string) => ({ url: image })),
                },
            },
        },
    });

    return ApiResponse(200, "Product created successfully");
});

export const seedProducts = AsyncHandler(async () => {
    await db.product.deleteMany();
    const reversed = products.reverse()
    for (const product of products) {
        console.log(product)
        const { images, ...productData } = product
        await db.product.create({
            data: productData
        })
    }
});

export const updateProduct = AsyncHandler(async (id: string, product: z.infer<typeof ProductSchema> & { images: string[] }): Promise<ApiResponseType<null>> => {
    const user = await getAuthUser();
    const existProduct = await db.product.findFirst({
        where: {
            id,
            seller_email: user.data.email
        }
    });
    if (!existProduct) return ApiResponse(400, "Product does not exist");

    if (user.data.role !== UserRole.ADMIN) {
        if (product.is_featured) {
            const featuredProductsCount = await db.product.count({
                where: {
                    seller_email: user.data.email,
                    is_featured: true,
                    NOT: {
                        id: id
                    }
                },
            });

            if (featuredProductsCount >= 5) {
                return ApiResponse(400, "You can only have a maximum of 5 featured products.");
            }
        }
    }

    const { images, ...productData } = product;
    await db.product.update({
        where: {
            id
        },
        data: {
            ...productData,
        }
    });

    await db.product.update({
        where: {
            id
        },
        data: {
            images: {
                createMany: {
                    data: [
                        ...images.map((image: string) => ({ url: image })),
                    ]
                }
            }
        }
    });

    return ApiResponse(200, "Product updated successfully");
});

export const deleteProduct = AsyncHandler(async (id: string): Promise<ApiResponseType<null>> => {
    await db.product.delete({
        where: {
            id,
            seller_email: (await getAuthUser()).data.email
        }
    })

    return ApiResponse(200, "Product deleted successfully")
})

export const deleteProductImage = AsyncHandler(async (id: string): Promise<ApiResponseType<null>> => {
    const user = await getAuthUser();
    await db.productMedia.delete({
        where: {
            id,
            product: {
                seller_email: user.data.email
            }
        }
    })

    return ApiResponse(200, "Product image deleted successfully")
})


export const createOrder = AsyncHandler(async ({ phone, address, orderItems }: { address: OrderAddress, phone: string, orderItems: CartItem[] }): Promise<ApiResponseType<null>> => {
    const user = await getAuthUser();
    if (!user.success) return ApiResponse(401, "Unauthorized");

    if (address.new && address.save) {
        await db.address.create({
            data: {
                user_id: user.data.id,
                full_address: address.full_address,
            }
        })
    }

    // Calculate total amount
    const totalAmount = orderItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = await db.order.create({
        data: {
            user_id: user.data.id,
            user_phone: phone,
            address: address.full_address,
            total_amount: totalAmount,
            order_items: {
                create: orderItems.map((item: any) => ({
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    total_amount: item.price * item.quantity,
                })),
            },
        },
    });

    console.log(order)

    return ApiResponse(201, "Order created successfully",);
});


export const getSellingOrders = AsyncHandler(async (
    query: DataTableQueryProps,
): Promise<ApiResponseType<TableDataType<Partial<OrderItem>> | null>> => {
    const currentUser = await getAuthUser();
    if (!currentUser.success) return ApiResponse(401, "Unauthorized");

    const search = query?.search ?? null;
    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Search functionality
    let whereClause={};
    whereClause = {
        order_items: {
            some: {
                product: {
                    seller_email: currentUser.data.email
                }
            }
        },
    };

    if (search) {
        whereClause = {
            ...whereClause,
            user: {
                name: {
                    contains: search,
                    mode: "insensitive", // Case-insensitive search
                }
            }
        };
    }

    const include = {
        id: true,
        user_id: true,
        user_phone: true,
        status: true,
        total_amount: true,
        address: true,
        created_at: true,
        updated_at: true,
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        },
        order_items: {
            select: {
                id: true,
                product_id: true,
                product_name: true,
                quantity: true,
                price: true,
                total_amount: true,
                status: true,
                created_at: true,
                product: true
            }
        },
    }

    // Sorting functionality
    const orderByClause = {
        [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
    };

    // Pagination calculations
    const offset = (page - 1) * limit;

    // Fetch data from the database
    const [orders, total_count] = await Promise.all([
        db.order.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: offset,
            take: Number(limit),
            select: include,
        }),
        db.order.count({
            where: whereClause,
        }),
    ]);

    // Determine the status of each order based on its order items
    const updatedOrders = orders.map(order => {
        const hasPendingItems = order.order_items.some(item => item.status === OrderStatus.PENDING);
        const status = hasPendingItems ? OrderStatus.PENDING : OrderStatus.COMPLETED;
        return { ...order, status };
    });

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Build the response structure
    const response_data: TableDataType<Partial<OrderItem>> = {
        data: updatedOrders,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Selling orders retrieved successfully", response_data);
});

export const getSellingOrder = AsyncHandler(async (id: string, include?: { [key: string]: boolean | { select: { [key: string]: boolean } } }): Promise<ApiResponseType<Partial<Order & { order_items: Partial<OrderItem>[] }> | null>> => {
    const currentUser = await getAuthUser();
    if (!currentUser.success) return ApiResponse(401, "Unauthorized");

    include = {
        id: true,
        user_id: true,
        user_phone: true,
        status: true,
        address: true,
        created_at: true,
        updated_at: true,
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        },
        ...include,
    }

    const order = await db.order.findUnique({
        where: {
            id,
        },
        select: {
            ...include,
        },
    })

    if (!order) return ApiResponse(404, "Order not found");

    const order_items = await db.orderItem.findMany({
        where: {
            order_id: id,
            product: {
                seller_email: currentUser.data.email
            },
        },
        select: {
            id: true,
            product_id: true,
            product_name: true,
            quantity: true,
            status: true,
            price: true,
            total_amount: true,
            created_at: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    images: true,
                    category_name: true,
                    seller: {
                        select: {
                            name: true,
                            email: true,
                        }
                    },
                }
            }
        },
    });

    const total_amount = order_items.reduce((sum: number, item: { total_amount: number }) => sum + item.total_amount, 0);

    console.log({ ...order, order_items, total_amount })
    return ApiResponse(200, "Order found", { ...order, order_items, total_amount })
})

export async function updateOrderItemStatus(orderItemId: string, newStatus: OrderStatus) {
    try {
        const orderItem = await db.orderItem.findUnique({
            where: { id: orderItemId },
            select: { status: true },
        });

        if (!orderItem) {
            return { success: false, error: 'Order item not found' };
        }

        if (orderItem.status !== OrderStatus.PENDING && newStatus === OrderStatus.PENDING) {
            return { success: false, error: 'Cannot change status to pending' };
        }

        if (orderItem.status === OrderStatus.COMPLETED) {
            return { success: false, error: 'Cannot change status of a completed order item' };
        }

        const updatedOrderItem = await db.orderItem.update({
            where: { id: orderItemId },
            data: { status: newStatus },
        });

        return { success: true, orderItem: updatedOrderItem };
    } catch (error) {
        console.error('Failed to update order item status:', error);
        return { success: false, error: 'Failed to update order item status' };
    }
}

export const getBuyingOrders = AsyncHandler(async (
    query: DataTableQueryProps,
): Promise<ApiResponseType<TableDataType<Partial<Order>> | null>> => {
    const currentUser = await getAuthUser();
    if (!currentUser.success) return ApiResponse(401, "Unauthorized");

    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Search functionality
    let whereClause: any = {
        user_id: currentUser.data.id
    };

    const include = {
        id: true,
        user_id: true,
        user_phone: true,
        status: true,
        total_amount: true,
        address: true,
        created_at: true,
        updated_at: true,
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        },
        order_items: {
            select: {
                id: true,
                product_id: true,
                product_name: true,
                quantity: true,
                price: true,
                total_amount: true,
                status: true,
                created_at: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        category_name: true,
                        seller: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                    }
                }
            }
        },
    }

    // Sorting functionality
    const orderByClause = {
        [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
    };

    // Pagination calculations
    const offset = (page - 1) * limit;

    // Fetch data from the database
    const [orders, total_count] = await Promise.all([
        db.order.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: offset,
            take: Number(limit),
            select: include,
        }),
        db.order.count({
            where: whereClause,
        }),
    ]);

    // Determine the status of each order based on its order items
    const updatedOrders = orders.map(order => {
        const hasPendingItems = order.order_items.some(item => item.status === OrderStatus.PENDING);
        const status = hasPendingItems ? OrderStatus.PENDING : OrderStatus.COMPLETED;
        return { ...order, status };
    });

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Build the response structure
    const response_data: TableDataType<Partial<Order>> = {
        data: updatedOrders,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Buying orders retrieved successfully", response_data);
});

export const getBuyingOrder = AsyncHandler(async (id: string): Promise<ApiResponseType<Partial<Order & { order_items: Partial<OrderItem>[] }> | null>> => {
    const user = await getAuthUser();
    const include = {
        id: true,
        user_id: true,
        user_phone: true,
        status: true,
        total_amount: true,
        address: true,
        created_at: true,
        updated_at: true,
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        },
        order_items: {
            select: {
                id: true,
                product_id: true,
                product_name: true,
                quantity: true,
                price: true,
                total_amount: true,
                created_at: true,
                status: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        category_name: true,
                        seller: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                    }
                }
            },
        },
    }

    const order = await db.order.findUnique({
        where: {
            id,
        },
        select: {
            ...include,
        },
    })

    if (!order) return ApiResponse(404, "Order not found");

    return ApiResponse(200, "Order found", order)
})

export const getCustomers = AsyncHandler(async (
    query: DataTableQueryProps,
): Promise<ApiResponseType<TableDataType<Partial<User>> | null>> => {
    const search = query?.search ?? null;
    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Search functionality
    let whereClause = {};

    whereClause = {
        orders: {
            some: {
                order_items: {
                    some: {
                        product: {
                            seller_email: (await getAuthUser()).data.email
                        }
                    }
                }
            }
        }
    }

    if (search) {
        whereClause = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
            ]
        };
    }

    // Sorting functionality
    const orderByClause = {
        [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
    };

    // Pagination calculations
    const offset = (page - 1) * limit;

    // Fetch data from the database
    const [customers, total_count] = await Promise.all([
        db.user.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: offset,
            take: Number(limit),
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
            },
        }),
        db.user.count({
            where: whereClause,
        }),
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Build the response structure
    const response_data: TableDataType<Partial<User>> = {
        data: customers,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Customers retrieved successfully", response_data);
});


export const getCustomer = AsyncHandler(async (id: string): Promise<ApiResponseType<Partial<User> | null>> => {
    const customer = await db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
        },
    });

    if (!customer) return ApiResponse(404, "Customer not found");

    return ApiResponse(200, "Customer found", customer);
});




export async function createSliderContent(data: z.infer<typeof SliderContentSchema>) {
    const user = await getAuthUser([UserRole.ADMIN]);
    if (!user.success) return ApiResponse(403, "Only admins can create slider content");

    const sliderContent = await db.sliderContent.create({
        data: {
            title: data.title!,
            description: data.description!,
            tag: data.tag!,
            product_id: data.product_id ?? "",
            start_at: data.start_at ?? new Date(),
            end_at: data.end_at ?? new Date(),
            status: data.status ?? "INACTIVE"
        },
    });

    return ApiResponse(201, "Slider content created", sliderContent);
}

export async function updateSliderContent(id: string, data: z.infer<typeof SliderContentSchema>) {
    const user = await getAuthUser([UserRole.ADMIN]);
    if (!user.success) return ApiResponse(403, "Only admins can update slider content");

    await db.sliderContent.update({
        where: { id },
        data: {
            title: data.title!,
            description: data.description!,
            tag: data.tag!,
            product_id: data.product_id ?? "",
            start_at: data.start_at ?? new Date(),
            end_at: data.end_at ?? new Date(),
            status: data.status ?? "INACTIVE"
        },
    });

    return ApiResponse(200, "Slider content updated");

}

export async function deleteSliderContent(id: string) {
    const user = await getAuthUser([UserRole.ADMIN]);
    if (!user.success) return ApiResponse(403, "Only admins can delete slider content");

    await db.sliderContent.delete({
        where: { id },
    });

    return ApiResponse(200, "Slider content deleted");
}


export const getSlidersContent = AsyncHandler(async (
    query: DataTableQueryProps & { admin?: boolean },
): Promise<ApiResponseType<TableDataType<SliderContent> | null>> => {
    const search = query?.search ?? null;
    const sort_by = query?.sort_by ?? "start_at";
    const sort_order = query?.sort_order ?? "asc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Search functionality
    let whereClause = {};

    if (search) {
        whereClause = {
            ...whereClause,
            title: { contains: search, mode: "insensitive" },
        };
    }
    if (!query?.admin) {
        whereClause = {
            ...whereClause,
            status: PublishStatus.ACTIVE,
            start_at: {
                lte: new Date(),
            },
            end_at: {
                gte: new Date(),
            },
        }
    }

    // Sorting functionality
    const orderByClause = {
        [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
    };

    // Pagination calculations
    const offset = (page - 1) * limit;

    // Fetch data from the database
    const [sliders, total_count] = await Promise.all([
        db.sliderContent.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: offset,
            take: Number(limit),
            select: {
                id: true,
                title: true,
                description: true,
                tag: true,
                product_id: true,
                product: {
                    select: {
                        name: true,
                        images: true,
                    }
                },
                start_at: true,
                end_at: true,
                status: true,
                created_at: true,
            },
        }),
        db.sliderContent.count({
            where: whereClause,
        }),
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Build the response structure
    const response_data: TableDataType<SliderContent> = {
        data: sliders,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Sliders retrieved successfully", response_data);
});

export async function getSliderContent(id: string): Promise<ApiResponseType<SliderContent>> {
    const slider = await db.sliderContent.findUnique({
        where: { id },
    });

    if (!slider) return ApiResponse(404, "Slider not found");

    return ApiResponse(200, "Slider found", slider);
}






export const createReview = AsyncHandler(async (productId: string, data: { rating: number; comment?: string; images: string[] }): Promise<ApiResponseType<null>> => {
    const user = await getAuthUser();
    if (!user.success) return ApiResponse(401, "Unauthorized");

    // console.log({ data })
    // Retrieve the last order made by the current user that includes the product
    const order = await db.order.findFirst({
        where: {
            user_id: user.data.id,
            order_items: {
                some: {
                    product_id: productId,
                    status: "COMPLETED",
                }
            },
        },
        orderBy: {
            created_at: "desc"
        }
    });

    if (!order) return ApiResponse(403, "You can only review products that you have purchased");

    // Check if user has already reviewed the product
    const existingReview = await db.review.findFirst({
        where: {
            product_id: productId,
            order_id: order.id,
            user_id: user.data.id
        }
    });

    console.log(order, existingReview)

    if (existingReview) return ApiResponse(400, "You have already reviewed this product");

    // Create review
    const review = await db.review.create({
        data: {
            product_id: productId,
            user_id: user.data.id,
            rating: data.rating,
            comment: data.comment,
            order_id: order.id,
            images: {
                createMany: {
                    data: data.images.map((url: string) => ({ url }))
                }
            }
        }
    });

    return ApiResponse(201, "Thank you for your feedback!");
});

export const getReviews = AsyncHandler(async (
    query: DataTableQueryProps & { admin?: boolean },
): Promise<ApiResponseType<TableDataType<Partial<Review>> | null>> => {
    const search = query?.search ?? null;
    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Search functionality
    let whereClause = {};

    if (search) {
        whereClause = {
            ...whereClause,
            title: { contains: search, mode: "insensitive" },
        };
    }
    if (!query?.admin) {
        whereClause = {
            ...whereClause,
            // status: PublishStatus.ACTIVE,
            product: {
                seller_email: (await getAuthUser()).data.email
            }
        }
    }

    // Pagination calculations
    const offset = (page - 1) * limit;

    const [reviews, total_count] = await Promise.all([
        db.review.findMany({
            where: whereClause,
            orderBy: {
                [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
            },
            skip: offset,
            take: limit,
            select: {
                id: true,
                order_id: true,
                product_id: true,
                rating: true,
                comment: true,
                created_at: true,
                product: {
                    select: {
                        name: true,
                        images: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        }),
        db.review.count({
        })
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    const response_data: TableDataType<Partial<Review>> = {
        data: reviews,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Reviews retrieved successfully", response_data);
});

export const getReview = AsyncHandler(async (id: string): Promise<ApiResponseType<Partial<Review & { product: Partial<Product> }> | null>> => {
    const review = await db.review.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            created_at: true,
            images: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    category_name: true,
                    images: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });

    if (!review) return ApiResponse(404, "Review not found");

    return ApiResponse(200, "Review found", review);
});

export const updateReview = AsyncHandler(async (
    reviewId: string,
    data: { rating: number; comment?: string }
): Promise<ApiResponseType<null>> => {
    const user = await getAuthUser();
    if (!user.success) return ApiResponse(401, "Unauthorized");

    // Check if review exists and belongs to user
    const review = await db.review.findFirst({
        where: {
            id: reviewId,
            user_id: user.data.id
        }
    });

    if (!review) return ApiResponse(404, "Review not found or unauthorized");

    // Update review
    await db.review.update({
        where: {
            id: reviewId
        },
        data: {
            rating: data.rating,
            comment: data.comment
        }
    });

    return ApiResponse(200, "Review updated successfully");
});

export const deleteReview = AsyncHandler(async (reviewId: string): Promise<ApiResponseType<null>> => {
    const user = await getAuthUser();
    if (!user.success) return ApiResponse(401, "Unauthorized");

    // Check if review exists and belongs to user
    const review = await db.review.findFirst({
        where: {
            id: reviewId,
            user_id: user.data.id
        }
    });

    if (!review) return ApiResponse(404, "Review not found or unauthorized");

    // Delete review
    await db.review.delete({
        where: {
            id: reviewId
        }
    });

    return ApiResponse(200, "Review deleted successfully");
});

export const getUserReviews = AsyncHandler(async (
    query: DataTableQueryProps
): Promise<ApiResponseType<TableDataType<Partial<Review>> | null>> => {
    const user = await getAuthUser();
    if (!user.success) return ApiResponse(401, "Unauthorized");

    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Pagination calculations
    const offset = (page - 1) * limit;

    const [reviews, total_count] = await Promise.all([
        db.review.findMany({
            where: {
                user_id: user.data.id
            },
            orderBy: {
                [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
            },
            skip: offset,
            take: limit,
            select: {
                id: true,
                rating: true,
                comment: true,
                created_at: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        images: true
                    }
                }
            }
        }),
        db.review.count({
            where: {
                user_id: user.data.id
            }
        })
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    const response_data: TableDataType<Partial<Review>> = {
        data: reviews,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "User reviews retrieved successfully", response_data);
});

export const getReviewsByProductId = AsyncHandler(async (
    productId: string,
    query: DataTableQueryProps
): Promise<ApiResponseType<TableDataType<Partial<Review>>>> => {
    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Pagination calculations
    const offset = (page - 1) * limit;

    const [reviews, total_count] = await Promise.all([
        db.review.findMany({
            where: {
                product_id: productId
            },
            orderBy: {
                [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
            },
            skip: offset,
            take: limit,
            select: {
                id: true,
                rating: true,
                comment: true,
                created_at: true,
                images: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        }),
        db.review.count({
            where: {
                product_id: productId
            }
        })
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    const response_data: TableDataType<Partial<Review>> = {
        data: reviews,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    return ApiResponse(200, "Reviews retrieved successfully", response_data);
});


export const getSellerDetails = AsyncHandler(async (id: string): Promise<ApiResponseType<Partial<User> | null>> => {
    const seller = await db.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            created_at: true,
        },
    });

    if (!seller) return ApiResponse(404, "Seller not found");

    return ApiResponse(200, "Seller found", seller);
});

export const getSellerProducts = AsyncHandler(async (
    id: string,
    query: DataTableQueryProps
): Promise<ApiResponseType<TableDataType<Partial<Product>> | null>> => {
    const sort_by = query?.sort_by ?? "created_at";
    const sort_order = query?.sort_order ?? "desc";
    const limit = Number(query?.limit ?? 10);
    const page = Number(query?.page ?? 1);

    // Pagination calculations
    const offset = (page - 1) * limit;

    const [products, total_count] = await Promise.all([
        db.product.findMany({
            where: { seller: { id } },
            orderBy: {
                [sort_by]: sort_order.toLowerCase() === "asc" ? "asc" : "desc",
            },
            skip: offset,
            take: limit,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                images: true,
                status: true,
                is_featured: true,
                category_name: true,
                created_at: true,
                updated_at: true,
            },
        }),
        db.product.count({
            where: { seller: { id } },
        }),
    ]);

    // Pagination info
    const total_pages = Math.ceil(total_count / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Build the response structure
    const response_data: TableDataType<Partial<Product>> = {
        data: products,
        totalCounts: total_count,
        totalPages: total_pages,
        hasNextPage: has_next,
        hasPreviousPage: has_previous,
        nextPage: page + 1,
        previousPage: page - 1,
    };

    if (!products.length) return ApiResponse(404, "No products found for this seller");

    return ApiResponse(200, "Products found", response_data);
});