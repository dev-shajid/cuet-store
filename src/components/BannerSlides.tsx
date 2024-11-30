'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { cn } from "@/lib/utils";

const slides = [
    {
        id: 1,
        title: "Classic Leather Loafers",
        description: "Atque eaque ducimus minima distinctio velit. Laborum et veniam officiis.",
        image: "/images/products/product-1.webp",
        tag: "Opening Sale Discount 50%",
    },
    {
        id: 2,
        title: "Premium Headphones",
        description: "Delectus ex saepe hic id laboriosam officia. Odit nostrum quas.",
        image: "/images/products/product-2.webp",
        tag: "Limited Offer 30%",
    },
    {
        id: 3,
        title: "Mountain Trekking Boots",
        description: "Laborum et veniam officiis. Delectus ex saepe hic id laboriosam officia.",
        image: "/images/products/product-3.webp",
        tag: "New Arrival",
    },
    {
        id: 4,
        title: "Elegance Stiletto Heels",
        description: "Laborum et veniam officiis. Delectus ex saepe hic id laboriosam officia.",
        image: "/images/products/product-4.webp",
        tag: "New Arrival",
    },
];

export default function BannerSlides() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000); // Slide change every 5 seconds
        return () => clearInterval(interval);
    }, [currentSlide]);

    const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full md:h-[500px] h-[600px] overflow-hidden bg-gradient-to-r from-background via-transparent to-background backdrop-blur-lg">
            <AnimatePresence mode="wait">
                {slides.map(
                    (slide, index) =>
                        index === currentSlide && (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0, filter: "blur(10px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(10px)" }}
                                transition={{ duration: .5, }}
                                className="absolute w-full h-full flex items-center"
                            >
                                <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
                                    {/* Left Section */}
                                    <div className="max-w-md">
                                        <span className="inline-block bg-yellow-400 text-black text-xs font-semibold uppercase px-3 py-1 rounded mb-4">
                                            {slide.tag}
                                        </span>
                                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                            {slide.title}
                                        </h1>
                                        <p className="text-sm mb-6">{slide.description}</p>
                                        <Button className="bg-blue-600 hover:bg-blue-700 rounded text-white">
                                            Shop now
                                        </Button>
                                    </div>

                                    {/* Right Section */}
                                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )
                )}
            </AnimatePresence>

            {/* Bottom Arrow Controls */}
            <div className="absolute bottom-4 w-full container left-1/2 flex justify-between transform -translate-x-1/2">
                <div className="flex items-center">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={cn(
                                'size-2 rounded-full mr-2 transition duration-500',
                                index === currentSlide ? "w-4 bg-foreground" : "bg-muted-foreground"
                            )}
                        ></span>
                    ))}
                </div>
                <div className="space-x-2">
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={prevSlide}
                        className="rounded-full"
                    >
                        <FaAngleLeft />
                    </Button>
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={nextSlide}
                        className="rounded-full"
                    >
                        <FaAngleRight />
                    </Button>
                </div>
            </div>
        </div>
    );
};
