import React from "react";
import ServicesHeading from "@/components/Home/Services/ServicesHeading";
import MotionServiceCard from "@/components/Home/Services/MotionServiceCard";
import ServiceIcon from "@/components/Home/Services/ServiceIcons";
import {SERVICES} from "@/constants/services.constants";
import UnderConstruction from "@/components/UnderConstruction";

const Services = () => {
    return (
        <section
            className="flex justify-center items-center py-24 relative mt-10"
        >
            <div
                className="mx-auto max-w-7xl p-8 "
            >
                <ServicesHeading delay={0} stagger={0.22}/>

                <div
                    className="mt-12 grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch"
                >
                    {SERVICES.map(({id, icon, name, description}, i) => (
                        <MotionServiceCard
                            key={id}
                            index={i}
                            delay={0}
                            stagger={0.25}
                            icon={<ServiceIcon name={icon}/>}
                            name={name}
                            description={description}
                        />
                    ))}
                </div>
            </div>
            <UnderConstruction/>
        </section>
    );
};

export default Services;
