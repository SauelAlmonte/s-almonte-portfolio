import React from "react";
import ServicesHeading from "@/components/Home/Services/ServicesHeading";
import MotionServiceCard from "@/components/Home/Services/MotionServiceCard";
import ServiceIcon from "@/components/Home/Services/ServiceIcons";
import { SERVICES } from "@/constants/services.constants";

const Services = () => {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-8">
                <ServicesHeading delay={6} stagger={0.22} />

                <div className="mt-16 grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
                    {SERVICES.map(({ id, icon, name, description }, i) => (
                        <MotionServiceCard
                            key={id}
                            index={i}
                            delay={7}
                            stagger={0.25}
                            icon={<ServiceIcon name={icon} />}
                            name={name}
                            description={description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
