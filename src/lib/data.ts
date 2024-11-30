export const categories = [
  {
    id: 1,
    name: "Men",
    imageUrl: "/images/categories/men.svg",
    is_featured: true
  },
  {
    id: 2,
    name: "Women",
    imageUrl: "/images/categories/women.svg",
    is_featured: true
  },
  {
    id: 3,
    name: "Watches",
    imageUrl: "/images/categories/watch.svg",
    is_featured: true
  },
  {
    id: 4,
    name: "Home appliances",
    imageUrl: "/images/categories/home-appliances.svg",
    is_featured: true
  },
  {
    id: 5,
    name: "Sport & outdoor",
    imageUrl: "/images/categories/sport.svg",
    is_featured: true
  },
  {
    id: 6,
    name: "Books & stationery",
    imageUrl: "/images/categories/book.svg",
    is_featured: true
  },
  {
    id: 7,
    name: "Home & living",
    imageUrl: "/images/categories/home-living.svg",
    is_featured: true
  },
  {
    id: 8,
    name: "Health",
    imageUrl: "/images/categories/health.svg",
    is_featured: true
  },
  {
    id: 9,
    name: "Mobile",
    imageUrl: "/images/categories/mobile.svg",
    is_featured: true
  },
  {
    id: 10,
    name: "Laptop",
    imageUrl: "/images/categories/laptop.svg",
    is_featured: true
  },
  {
    id: 11,
    name: "Tablet",
    imageUrl: "/images/categories/tablet.svg",
    is_featured: true
  },
  {
    id: 12,
    name: "Headphones",
    imageUrl: "/images/categories/headphones.svg",
    is_featured: true
  }
];


export const products = [
  {
    id: 1,
    name: "Apple Watch Ultra",
    price: "$83.74",
    images: ["/images/products/product-1.webp"],
    rating: 4.5,
    is_featured: true,
    category_id: 3,
    description: "Apple Watch Ultra for top-tier fitness tracking and advanced health features.",
    reviews: [
      { username: "John", rating: 5, comment: "Excellent smartwatch for fitness." },
      { username: "Emily", rating: 4, comment: "Great, but battery could last longer." }
    ]
  },
  {
    id: 2,
    name: "Samsung Galaxy Buds",
    price: "$97.14",
    images: ["/images/products/product-2.webp"],
    rating: 4.0,
    is_featured: true,
    category_id: 12,
    description: "Samsung Galaxy Buds deliver an immersive audio experience.",
    reviews: [
      { username: "Jake", rating: 4, comment: "Great sound quality." },
      { username: "Sarah", rating: 5, comment: "Comfortable and clear sound." }
    ]
  },
  {
    id: 3,
    name: "Nike Air Max",
    price: "$68.71",
    images: ["/images/products/product-3.webp"],
    rating: 4.2,
    is_featured: true,
    category_id: 5,
    description: "Nike Air Max for stylish and comfortable daily wear.",
    reviews: [
      { username: "Chris", rating: 4, comment: "Trendy and comfy." },
      { username: "Laura", rating: 5, comment: "Perfect fit for casual wear!" }
    ]
  },
  {
    id: 4,
    name: "Adidas Ultraboost",
    price: "$85.21",
    images: ["/images/products/product-4.webp"],
    rating: 4.5,
    is_featured: true,
    category_id: 5,
    description: "Adidas Ultraboost provides premium comfort for running and workouts.",
    reviews: [
      { username: "Mike", rating: 5, comment: "Best running shoes ever!" },
      { username: "Emma", rating: 4, comment: "Very comfy and supportive." }
    ]
  },
  {
    id: 5,
    name: "Sony PlayStation",
    price: "$52.17",
    images: ["/images/products/product-5.webp"],
    rating: 4.8,
    is_featured: true,
    category_id: 9,
    description: "Sony PlayStation 5 for next-gen immersive gaming.",
    reviews: [
      { username: "Liam", rating: 5, comment: "Amazing gaming console!" },
      { username: "Sophia", rating: 4, comment: "Incredible graphics." }
    ]
  },
  {
    id: 6,
    name: "Microsoft Surface",
    price: "$25.18",
    images: ["/images/products/product-6.webp"],
    rating: 4.0,
    is_featured: true,
    category_id: 10,
    description: "Microsoft Surface, the versatile 2-in-1 laptop for work and creativity.",
    reviews: [
      { username: "Olivia", rating: 4, comment: "Perfect for productivity." },
      { username: "Ethan", rating: 5, comment: "Very sleek design." }
    ]
  },
  {
    id: 7,
    name: "Tesla Modal S",
    price: "$43.84",
    images: ["/images/products/product-7.webp"],
    rating: 4.6,
    is_featured: true,
    category_id: 4,
    description: "Tesla Modal S with advanced electric performance and premium comfort.",
    reviews: [
      { username: "Noah", rating: 5, comment: "Love the tech and efficiency!" },
      { username: "Isabella", rating: 4, comment: "Amazing drive but expensive." }
    ]
  },
  {
    id: 8,
    name: "Amazon Echo",
    price: "$60.98",
    images: ["/images/products/product-8.webp"],
    rating: 4.5,
    is_featured: true,
    category_id: 4,
    description: "Amazon Echo for smarter home automation and entertainment.",
    reviews: [
      { username: "Ava", rating: 5, comment: "Super helpful assistant!" },
      { username: "James", rating: 4, comment: "Great smart device for daily use." }
    ]
  },
  {
    id: 9,
    name: "Google Pixel",
    price: "$98.42",
    images: ["/images/products/product-9.webp"],
    rating: 4.7,
    is_featured: true,
    category_id: 9,
    description: "Google Pixel phone with an excellent camera and clean Android experience.",
    reviews: [
      { username: "Benjamin", rating: 5, comment: "Amazing camera and smooth interface!" },
      { username: "Charlotte", rating: 4, comment: "Best for photography." }
    ]
  },
  {
    id: 10,
    name: "Bose QuietComfort",
    price: "$53.37",
    images: ["/images/products/product-10.webp"],
    rating: 4.5,
    is_featured: true,
    category_id: 12,
    description: "Bose QuietComfort headphones with outstanding noise cancellation.",
    reviews: [
      { username: "Henry", rating: 5, comment: "Superb noise cancellation and sound." },
      { username: "Amelia", rating: 4, comment: "Comfortable for long hours." }
    ]
  },
  {
    id: 11,
    name: "Canon EOS",
    price: "$72.75",
    images: ["/images/products/product-11.webp"],
    rating: 4.8,
    is_featured: true,
    category_id: 4,
    description: "Canon EOS DSLR for professional-grade photography and videography.",
    reviews: [
      { username: "Mia", rating: 5, comment: "Best camera for professionals." },
      { username: "Alexander", rating: 4, comment: "Great value for quality." }
    ]
  },
  {
    id: 12,
    name: "HP Spectre",
    price: "$56.61",
    images: ["/images/products/product-12.webp"],
    rating: 4.6,
    is_featured: true,
    category_id: 10,
    description: "HP Spectre laptop offers high performance with a premium build.",
    reviews: [
      { username: "Ella", rating: 5, comment: "Love the sleek design and speed." },
      { username: "Lucas", rating: 4, comment: "Excellent for multitasking." }
    ]
  },
  {
    id: 13,
    name: "LG OLED",
    price: "$64.55",
    images: ["/images/products/product-13.webp"],
    rating: 4.9,
    is_featured: true,
    category_id: 10,
    description: "LG OLED TVs offer unparalleled picture quality and vibrant colors.",
    reviews: [
      { username: "Harper", rating: 5, comment: "Top-notch TV experience." },
      { username: "Daniel", rating: 4, comment: "Stunning visuals." }
    ]
  },
  {
    id: 14,
    name: "Rolex Submariner",
    price: "$77.32",
    images: ["/images/products/product-14.webp"],
    rating: 4.7,
    is_featured: true,
    category_id: 3,
    description: "Rolex Submariner is a luxury watch with enduring design.",
    reviews: [
      { username: "Jack", rating: 5, comment: "Timeless and elegant." },
      { username: "Scarlett", rating: 4, comment: "Amazing build quality." }
    ]
  },
  {
    id: 15,
    name: "Chanel No.5",
    price: "$60.62",
    images: ["/images/products/product-15.webp"],
    rating: 4.3,
    is_featured: true,
    category_id: 6,
    description: "Chanel No.5 is a classic fragrance for a refined lifestyle.",
    reviews: [
      { username: "Sophie", rating: 5, comment: "Absolutely love this scent!" },
      { username: "Leo", rating: 4, comment: "Long-lasting and elegant." }
    ]
  },
  {
    id: 16,
    name: "Louis Vuitton Speedy",
    price: "$79.81",
    images: ["/images/products/product-16.webp"],
    rating: 4.6,
    is_featured: true,
    category_id: 6,
    description: "Louis Vuitton Speedy bag for high-end fashion lovers.",
    reviews: [
      { username: "Grace", rating: 5, comment: "Stylish and iconic." },
      { username: "Eleanor", rating: 4, comment: "Expensive but worth it." }
    ]
  },
  {
    id: 17,
    name: "Gucci Ace",
    price: "$93.68",
    images: ["/images/products/product-17.webp"],
    rating: 4.7,
    is_featured: true,
    category_id: 2,
    description: "Gucci Ace Sneakers for the fashion-forward.",
    reviews: [
      { username: "Olivia", rating: 5, comment: "Trendy and chic!" },
      { username: "Ethan", rating: 4, comment: "Comfortable but pricey." }
    ]
  },
  {
    id: 18,
    name: "Ray-Ban Aviator",
    price: "$47.44",
    images: ["/images/products/product-18.webp"],
    rating: 4.5,
    is_featured: true,
    category_id: 2,
    description: "Ray-Ban Aviator Sunglasses for classic style.",
    reviews: [
      { username: "Liam", rating: 5, comment: "Perfect summer accessory." },
      { username: "Charlotte", rating: 4, comment: "Stylish and effective." }
    ]
  },
  {
    id: 19,
    name: "Herschel Little America",
    price: "$76.24",
    images: ["/images/products/product-19.webp"],
    rating: 4.6,
    is_featured: true,
    category_id: 7,
    description: "Herschel Little America backpack for travel and daily needs.",
    reviews: [
      { username: "Lucas", rating: 5, comment: "Perfect backpack for trips." },
      { username: "Ella", rating: 4, comment: "Great storage and design." }
    ]
  },
  {
    id: 20,
    name: "Le Creuset Dutch Oven",
    price: "$92.87",
    images: ["/images/products/product-20.webp"],
    rating: 4.7,
    is_featured: true,
    category_id: 7,
    description: "Le Creuset Dutch Oven for professional-level cooking.",
    reviews: [
      { username: "Benjamin", rating: 5, comment: "Perfect for slow-cooking." },
      { username: "Isabella", rating: 4, comment: "High quality but heavy." }
    ]
  },
  {
    id: 21,
    name: "Yeti Tumbler",
    price: "$72.91",
    images: ["/images/products/product-21.webp"],
    rating: 4.8,
    is_featured: true,
    category_id: 7,
    description: "Yeti Tumbler for keeping beverages hot or cold.",
    reviews: [
      { username: "Mia", rating: 5, comment: "Great for daily use." },
      { username: "Alexander", rating: 4, comment: "Works as advertised." }
    ]
  },
  {
    id: 22,
    name: "Patagonia Nano Puff",
    price: "$20.54",
    images: ["/images/products/product-22.webp"],
    rating: 4.3,
    is_featured: true,
    category_id: 7,
    description: "Patagonia Nano Puff for lightweight warmth during outdoor adventures.",
    reviews: [
      { username: "Ava", rating: 5, comment: "Excellent for hiking." },
      { username: "James", rating: 4, comment: "Light and warm, perfect for fall." }
    ]
  },
  {
    id: 23,
    name: "Lululemon Align Leggings",
    price: "$94.25",
    images: ["/images/products/product-23.webp"],
    rating: 4.6,
    is_featured: true,
    category_id: 2,
    description: "Lululemon Align Leggings for ultimate comfort during workouts.",
    reviews: [
      { username: "Henry", rating: 5, comment: "Super comfy and soft." },
      { username: "Amelia", rating: 4, comment: "Perfect for yoga and running." }
    ]
  },
  {
    id: 24,
    name: "Allbirds Wool Runners",
    price: "$37.51",
    images: ["/images/products/product-24.webp"],
    rating: 4.4,
    is_featured: true,
    category_id: 5,
    description: "Allbirds Wool Runners for eco-friendly and comfortable footwear.",
    reviews: [
      { username: "Sophie", rating: 5, comment: "Super light and stylish." },
      { username: "Leo", rating: 4, comment: "Perfect for everyday wear." }
    ]
  }
];
