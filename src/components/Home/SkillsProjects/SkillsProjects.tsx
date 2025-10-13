'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SkillsProjectsCard from '@/components/Home/SkillsProjects/SkillsProjectsCard';
import UnderConstruction from '@/components/UnderConstruction';
import SkillsProjectsHeading from '@/components/Home/SkillsProjects/SkillsProjectsHeading';

import {
    buildContainer,
    buildItem,
    inViewTrigger,
} from '@/_lib/motion-presets';
import { useScrollReveal } from '@/_lib/useScrollReveal';

import { SKILL_BLOCKS } from '@/constants/skills.constants';

const SkillsProjects = () => {
    const { ref: sectionRef, state: currentState } =
        useScrollReveal(inViewTrigger);
    const container = buildContainer(0.18, 0.28, 0.5);
    const item = buildItem(16, 0.28);

    return (
        <section ref={sectionRef} className="py-24 relative mt-10 min-h-dvh">
            <motion.div
                variants={container}
                initial="hidden"
                animate={currentState}
                className="mx-auto max-w-7xl px-10"
            >
                <motion.div variants={item}>
                    <SkillsProjectsHeading
                        id="skills-heading"
                        delay={0}
                        stagger={0.18}
                    />
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16"
                    variants={container}
                >
                    {SKILL_BLOCKS.map((b, i) => (
                        <motion.div key={b.title} variants={item}>
                            <SkillsProjectsCard
                                title={b.title}
                                chartData={b.chartData}
                                chartConfig={b.chartConfig}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
            <UnderConstruction />
        </section>
    );
};

export default SkillsProjects;
