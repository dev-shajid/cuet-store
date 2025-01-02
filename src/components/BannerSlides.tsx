'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { getSlidersContent } from "@/lib/action";
import { SliderContent } from "@prisma/client";
import { Product } from "@/types/type";
import { LinkButton } from "./ui/link-button";


interface SlideProps {
    id: string;
    product_id: string;
    title: string;
    description: string;
    image: string;
    tag: string;
}

export default function BannerSlides() {
    const [slides, setSlides] = useState<SlideProps[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSlides() {
            const response = await getSlidersContent();
            if (response.success) {
                const formattedSlides = response?.data?.data.map((slide: SliderContent & { product: Product }) => ({
                    id: slide.id,
                    title: slide.title,
                    description: slide.description,
                    image: slide.product.images[0].url!, // Assuming the first image is the one you want to use
                    tag: slide.tag,
                    product_id: slide.product_id,
                }));
                setSlides(formattedSlides);
            }
            setLoading(false);
        }
        fetchSlides();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000); // Slide change every 3 seconds
        return () => clearInterval(interval);
    }, [currentSlide, slides.length]);

    const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

    if (loading) {
        return (
            <div className="relative w-full md:h-[500px] h-[600px] overflow-hidden bg-gradient-to-r from-background via-transparent to-background backdrop-blur-lg">
                <div className="absolute w-full h-full flex items-center">
                    <div className="container mx-auto px-8 flex flex-col gap-4 md:flex-row items-center justify-between">
                        {/* Left Section */}
                        <div className="max-w-md flex-1">
                            <div className="bg-muted animate-pulse h-8 max-w-[150px] w-full rounded mb-4"/>
                            <div className="bg-muted animate-pulse h-8 max-w-[250px] w-full rounded mb-4"/>
                            <div className="bg-muted animate-pulse h-16 max-w-[350px] w-full rounded mb-4"/>
                            <div className="bg-muted animate-pulse h-8 max-w-[100px] w-full rounded mb-4"/>
                        </div>

                        {/* Right Section Skeleton */}
                        <div className="relative aspect-square h-[300px] md:h-[400px] bg-muted animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full md:h-[500px] h-[600px] overflow-hidden bg-gradient-to-r from-background via-transparent to-background backdrop-blur-lg">
            <AnimatePresence mode="wait">
                {slides?.map(
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
                                        <LinkButton href={`/products/${slide.product_id}`} className="bg-blue-600 hover:bg-blue-700 rounded text-white">
                                            Shop now
                                        </LinkButton>
                                    </div>

                                    {/* Right Section */}
                                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            style={{ objectFit: "contain" }}
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
