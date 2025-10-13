'use client';

import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ClientReviewCard from '@/components/Home/ClientReview/ClientReviewCard';
import UnderConstruction from '@/components/UnderConstruction';

import { motion } from 'framer-motion';
import {
    buildContainer,
    buildItem,
    inViewTrigger,
} from '@/_lib/motion-presets';
import { useScrollReveal } from '@/_lib/useScrollReveal';
import ClientReviewHeading from '@/components/Home/ClientReview/ClientReviewHeading';

type CustomDotProps = {
    onClick?: () => void;
    active?: boolean;
    index?: number;
    [key: string]: unknown;
};

const CustomDot = ({ onClick, active, index }: CustomDotProps) => (
    <button
        onClick={onClick}
        aria-label={`Go to slide ${index !== undefined ? index + 1 : ''}`}
        className={`mx-1 rounded-full border-none hover:cursor-pointer 
                hover:bg-cyan-300 hover:w-4 hover:h-4 transition-all duration-200 
                ${active ? 'bg-cyan-300 w-4 h-4' : 'bg-zinc-700 w-3 h-3 opacity-50'}`}
        type="button"
    />
);

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1324 },
        items: 3,
        slidesToSlide: 1,
    },
    tablet: { breakpoint: { max: 1324, min: 764 }, items: 2, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 764, min: 0 }, items: 1, slidesToSlide: 1 },
};

const ClientReview = () => {
    // unified in-view trigger (same pattern as Services/Resume/Skills)
    const { ref: sectionRef, state: currentState } =
        useScrollReveal(inViewTrigger);

    // OUTER container → controls heading reveal
    // (staggerGap, startDelay, parentDuration)
    const containerSection = buildContainer(0.12, 0.1, 0.44);

    // INNER container → controls pause after heading + stagger of cards
    // tweak second arg to change the pause after the heading
    const containerCards = buildContainer(0.09, 0.12, 0.42);

    // Item animation (y distance, duration)
    const item = buildItem(12, 0.22);

    return (
        <section ref={sectionRef} className="py-24 relative mt-10 min-h-dvh">
            <motion.div
                variants={containerSection}
                initial="hidden"
                animate={currentState}
                className="max-w-7xl mx-auto px-10"
            >
                <motion.div variants={item}>
                    <ClientReviewHeading
                        id="client-review-heading"
                        delay={0}
                        stagger={0.18}
                    />
                </motion.div>

                {/* Cards wrapper uses INNER container so we control delay + stagger */}
                <motion.div variants={containerCards} className="mt-8">
                    <Carousel
                        className="pb-12"
                        swipeable
                        draggable={false}
                        showDots
                        responsive={responsive}
                        infinite
                        autoPlay
                        autoPlaySpeed={5000}
                        customDot={<CustomDot />}
                        dotListClass="flex justify-center mt-8 space-x-2"
                        itemClass="carousel-item-padding-40-px"
                        arrows={false}
                    >
                        <motion.div variants={item}>
                            <ClientReviewCard
                                image="/images/me.png"
                                name="Sauel Almonte"
                                role="CEO Landscape"
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <ClientReviewCard
                                image="/images/c1.png"
                                name="Jane Doe"
                                role="CEO Landscape"
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <ClientReviewCard
                                image="/images/c2.png"
                                name="John Smith"
                                role="CEO Landscape"
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <ClientReviewCard
                                image="/images/c3.png"
                                name="Sarah Connor"
                                role="CEO Landscape"
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <ClientReviewCard
                                image="/images/c4.png"
                                name="Michael Brown"
                                role="CEO Landscape"
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <ClientReviewCard
                                image="/images/c5.png"
                                name="Howard Johnson"
                                role="CEO Landscape"
                            />
                        </motion.div>
                    </Carousel>
                </motion.div>
            </motion.div>
            <UnderConstruction />
        </section>
    );
};

export default ClientReview;
