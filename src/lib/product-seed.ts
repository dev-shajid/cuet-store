import { z } from "zod";
import { ProductSchema } from "./schema";
import { PublishStatus } from "@prisma/client";

export const products: (z.infer<typeof ProductSchema> & { images: string[], seller_email: string })[] = [
    {
        "name": "Apple Watch Ultra",
        "description": "Apple Watch Ultra for top-tier fitness tracking and advanced health features.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 45,
        "price": 689,
        "category_name": "Watches",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Samsung Galaxy Buds",
        "description": "Samsung Galaxy Buds deliver an immersive audio experience.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 24,
        "price": 512,
        "category_name": "Headphones",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Nike Air Max",
        "description": "Nike Air Max for stylish and comfortable daily wear.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 30,
        "price": 276,
        "category_name": "Sport & outdoor",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Adidas Ultraboost",
        "description": "Adidas Ultraboost provides premium comfort for running and workouts.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 80,
        "price": 411,
        "category_name": "Sport & outdoor",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Sony PlayStation",
        "description": "Sony PlayStation 5 for next-gen immersive gaming.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 68,
        "price": 953,
        "category_name": "Mobile",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Microsoft Surface",
        "description": "Microsoft Surface, the versatile 2-in-1 laptop for work and creativity.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 55,
        "price": 834,
        "category_name": "Laptop",
        "seller_email": "shajid@gmail.com",
        "images": ["https://res.cloudinary.com/shajib/image/upload/v1732008455/product-6_qifxym.webp"]
    },
    {
        "name": "Tesla Modal S",
        "description": "Tesla Modal S with advanced electric performance and premium comfort.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 11,
        "price": 767,
        "category_name": "Home appliances",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Amazon Echo",
        "description": "Amazon Echo for smarter home automation and entertainment.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 42,
        "price": 299,
        "category_name": "Home appliances",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Google Pixel",
        "description": "Google Pixel phone with an excellent camera and clean Android experience.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 97,
        "price": 914,
        "category_name": "Mobile",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Bose QuietComfort",
        "description": "Bose QuietComfort headphones with outstanding noise cancellation.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 49,
        "price": 487,
        "category_name": "Headphones",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Canon EOS",
        "description": "Canon EOS DSLR for professional-grade photography and videography.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 33,
        "price": 819,
        "category_name": "Home appliances",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "HP Spectre",
        "description": "HP Spectre laptop offers high performance with a premium build.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 50,
        "price": 403,
        "category_name": "Laptop",
        "seller_email": "shajid@gmail.com",
        "images": ["https://res.cloudinary.com/shajib/image/upload/v1732008457/product-12_ri6apa.webp"]
    },
    {
        "name": "LG OLED",
        "description": "LG OLED TVs offer unparalleled picture quality and vibrant colors.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 66,
        "price": 706,
        "category_name": "Laptop",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Rolex Submariner",
        "description": "Rolex Submariner is a luxury watch with enduring design.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 76,
        "price": 687,
        "category_name": "Watches",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Chanel No.5",
        "description": "Chanel No.5 is a classic fragrance for a refined lifestyle.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 74,
        "price": 483,
        "category_name": "Books & stationery",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Louis Vuitton Speedy",
        "description": "Louis Vuitton Speedy bag for high-end fashion lovers.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 23,
        "price": 858,
        "category_name": "Books & stationery",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Gucci Ace",
        "description": "Gucci Ace Sneakers for the fashion-forward.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 81,
        "price": 642,
        "category_name": "Women",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Ray-Ban Aviator",
        "description": "Ray-Ban Aviator Sunglasses for classic style.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 98,
        "price": 489,
        "category_name": "Women",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Herschel Little America",
        "description": "Herschel Little America backpack for travel and daily needs.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 78,
        "price": 801,
        "category_name": "Home & living",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Le Creuset Dutch Oven",
        "description": "Le Creuset Dutch Oven for professional-level cooking.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 61,
        "price": 933,
        "category_name": "Home & living",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Yeti Tumbler",
        "description": "Yeti Tumbler for keeping beverages hot or cold.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 40,
        "price": 209,
        "category_name": "Home & living",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Patagonia Nano Puff",
        "description": "Patagonia Nano Puff for lightweight warmth during outdoor adventures.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 56,
        "price": 602,
        "category_name": "Home & living",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Lululemon Align Leggings",
        "description": "Lululemon Align Leggings for ultimate comfort during workouts.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 52,
        "price": 742,
        "category_name": "Home & living",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    },
    {
        "name": "Allbirds Wool Runners",
        "description": "Allbirds Wool Runners for eco-friendly and comfortable footwear.",
        "is_featured": true,
        "status": PublishStatus.ACTIVE,
        "stock": 46,
        "price": 531,
        "category_name": "Sport & outdoor",
        "seller_email": "shajid@gmail.com",
        "images": [""]
    }
]
