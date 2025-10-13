// components/Home/Resume/Resume.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ResumeCard from '@/components/Home/Resume/ResumeCard';
import { EXPERIENCE, EDUCATION } from '@/constants/resume.constants';
import ResumeHeading from '@/components/Home/Resume/ResumeHeading';
import {
    buildContainer,
    buildItem,
    inViewTrigger,
} from '@/_lib/motion-presets';
import { useScrollReveal } from '@/_lib/useScrollReveal';
// import ResumeDeck from '@/components/Home/Resume/ResumeDeck';
import UnderConstruction from '@/components/UnderConstruction';

const Resume = () => {
    // unified scroll trigger + a11y guard
    const { ref: sectionRef, state: currentState } =
        useScrollReveal(inViewTrigger);

    // variants (identical timing to Services)
    const container = buildContainer(0.18, 0.28, 0.5);
    const item = buildItem(16, 0.28);

    return (
        <section ref={sectionRef} className="py-24 relative mt-10 min-h-dvh">
            <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 lg:grid-cols-2 px-10">
                {/* Wrap the whole content so headings + cards stagger in on scroll */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate={currentState}
                    className="contents"
                >
                    {/* Work Experience Section */}
                    <motion.div variants={item} className="py-6">
                        <ResumeHeading
                            id="exp-heading"
                            prefix="Work"
                            accent="Experience"
                            delay={0}
                            stagger={0.18}
                        />

                        <motion.div className="mt-10" variants={container}>
                            {EXPERIENCE.map((itemData, i) => (
                                <motion.div key={`exp-${i}`} variants={item}>
                                    <ResumeCard
                                        Icon={itemData.Icon}
                                        title={itemData.title}
                                        role={itemData.role}
                                        description={itemData.description}
                                        date={itemData.date}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Education */}
                    <motion.div variants={item} className="py-6">
                        <ResumeHeading
                            id="edu-heading"
                            prefix="My"
                            accent="Education"
                            delay={0}
                            stagger={0.18}
                        />

                        <motion.div className="mt-10" variants={container}>
                            {EDUCATION.map((itemData, i) => (
                                <motion.div key={`edu-${i}`} variants={item}>
                                    <ResumeCard
                                        Icon={itemData.Icon}
                                        title={itemData.title}
                                        role={itemData.role}
                                        description={itemData.description}
                                        date={itemData.date}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            <UnderConstruction />
        </section>
    );
};

export default Resume;
