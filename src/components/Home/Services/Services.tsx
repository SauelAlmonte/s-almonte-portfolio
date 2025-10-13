// components/Home/Services/Services.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ServicesHeading from '@/components/Home/Services/ServicesHeading';
import MotionServiceCard from '@/components/Home/Services/MotionServiceCard';
import ServiceIcon from '@/components/Home/Services/ServiceIcons';
import { SERVICES } from '@/constants/services.constants';
import {
    buildContainer,
    buildItem,
    inViewTrigger,
} from '@/_lib/motion-presets';
import { useScrollReveal } from '@/_lib/useScrollReveal';
// import UnderConstruction from '@/components/UnderConstruction';

const Services = () => {
    // === unified in-view trigger + a11y motion guard ===
    const { ref: sectionRef, state: currentState } =
        useScrollReveal(inViewTrigger);

    // === variants (centralized presets; same cadence as before) ===
    const container = buildContainer(0.18, 0.28, 0.5);
    const item = buildItem(16, 0.28);

    return (
        <section
            ref={sectionRef}
            className="min-h-dvh flex justify-center items-center py-24 relative mt-10"
        >
            <div className="mx-auto max-w-7xl p-8 ">
                {/* wrap heading/grid so they reveal on scroll */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate={currentState}
                >
                    <motion.div variants={item}>
                        <ServicesHeading delay={0} stagger={0.22} />
                    </motion.div>

                    <motion.div
                        className="mt-12 grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch"
                        variants={container}
                    >
                        {SERVICES.map(({ id, icon, name, description }, i) => (
                            <motion.div key={id} variants={item}>
                                <MotionServiceCard
                                    index={i}
                                    delay={0}
                                    stagger={0.25}
                                    icon={<ServiceIcon name={icon} />}
                                    name={name}
                                    description={description}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Credibility row (keep commented for now) */}
                    {/*
          <motion.ul
            className="mt-8 grid grid-cols-3 gap-4 text-center text-cyan-100/80 text-xs md:text-sm"
            variants={container}
          >
            {METRICS.map(({ id, value, label }) => (
              <motion.li key={id} variants={item} className="leading-tight">
                <span className="font-bold text-cyan-300">{value}</span>{' '}{label}
              </motion.li>
            ))}
          </motion.ul>
          */}
                </motion.div>
            </div>
            {/*<UnderConstruction/>*/}
        </section>
    );
};

export default Services;
