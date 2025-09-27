"use client";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ClientReviewCard from "@/components/Home/ClientReview/ClientReviewCard";
import UnderConstruction from "@/components/UnderConstruction";

type CustomDotProps = {
    onClick?: () => void;
    active?: boolean;
    index?: number;
    [key: string]: unknown;
};


// Custom Dot component (function, no ...rest)
const CustomDot = ({onClick, active, index}: CustomDotProps) => (
    <button
        onClick={onClick}
        aria-label={`Go to slide ${index !== undefined ? index + 1 : ""}`}
        className={`mx-1 rounded-full border-none hover:cursor-pointer 
                    hover:bg-cyan-300 hover:w-4 hover:h-4 transition-all duration-200 
                    ${active ? "bg-cyan-300 w-4 h-4" : "bg-zinc-700 w-3 h-3 opacity-50"}`
        }
        type="button"
    />
);

const responsive = {
    desktop: {
        breakpoint: {max: 3000, min: 1324},
        items: 3,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: {max: 1324, min: 764},
        items: 2,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: {max: 764, min: 0},
        items: 1,
        slidesToSlide: 1,
    }
};

const ClientReview = () => {
    return (
        <section className="py-24 relative mt-10">
            <h2 className="text-center text-2xl md:text-4xl xl:text5xl font-bold text-zinc-50">
                Words from our <br/>
                <span className="text-cyan-300">Satisfied Clients&#33;</span>
            </h2>
            <div className="px-10 mt-8 max-w-7xl mx-auto">
                <Carousel
                    className="pb-12"
                    swipeable={true}
                    draggable={false}
                    showDots={true}
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    customDot={<CustomDot/>}    // Pass as JSX, per doc screenshot
                    dotListClass="flex justify-center mt-8 space-x-2"
                    itemClass="carousel-item-padding-40-px"
                    arrows={false}
                >
                    <ClientReviewCard
                        image="/images/me.png"
                        name="Sauel Almonte"
                        role="CEO Landscape"
                    />
                    <ClientReviewCard
                        image="/images/c1.png"
                        name="Jane Doe"
                        role="CEO Landscape"
                    />
                    <ClientReviewCard
                        image="/images/c2.png"
                        name="John Smith"
                        role="CEO Landscape"
                    />
                    <ClientReviewCard
                        image="/images/c3.png"
                        name="JSarah Connor"
                        role="CEO Landscape"
                    />
                    <ClientReviewCard
                        image="/images/c4.png"
                        name="Michael Brown"
                        role="CEO Landscape"
                    />
                    <ClientReviewCard
                        image="/images/c5.png"
                        name="JHoward Johnson"
                        role="CEO Landscape"
                    />
                </Carousel>
                <UnderConstruction/>
            </div>
        </section>
    );
};

export default ClientReview;
