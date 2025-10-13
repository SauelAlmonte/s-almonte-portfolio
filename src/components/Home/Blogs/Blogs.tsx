'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BlogsCard from '@/components/Home/Blogs/BlogsCard';
import BlogsHeading from '@/components/Home/Blogs/BlogsHeading';
import { blogLinks } from '@/constants/blogsLinkConstant';
import UnderConstruction from '@/components/UnderConstruction';

import {
    buildContainer,
    buildItem,
    inViewTrigger,
} from '@/_lib/motion-presets';
import { useScrollReveal } from '@/_lib/useScrollReveal';

const Blogs = () => {
    // same reveal rhythm as other sections
    const { ref: sectionRef, state: currentState } =
        useScrollReveal(inViewTrigger);

    // OUTER: heading reveal
    const containerSection = buildContainer(0.12, 0.1, 0.44);

    // INNER: pause after heading + stagger cards (tweak 2nd arg for the pause)
    const containerCards = buildContainer(0.1, 0.12, 0.42);

    // Item: per-card motion
    const item = buildItem(12, 0.22);

    return (
        <section ref={sectionRef} className="py-24 relative mt-10 min-h-dvh">
            <motion.div
                variants={containerSection}
                initial="hidden"
                animate={currentState}
                className="mx-auto max-w-7xl p-8"
            >
                <motion.div variants={item}>
                    <BlogsHeading id="blogs-heading" delay={0} stagger={0.18} />
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 md:gap-6 items-center justify-center"
                    variants={containerCards}
                >
                    {blogLinks.map((blog) => (
                        <motion.div key={blog.href} variants={item}>
                            <BlogsCard
                                image={blog.image}
                                title={blog.title}
                                date={blog.date}
                                href={blog.href}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
            <UnderConstruction />
        </section>
    );
};

export default Blogs;
