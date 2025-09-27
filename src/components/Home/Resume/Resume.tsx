import React from "react";
import ResumeCard from "@/components/Home/Resume/ResumeCard";
import {FaCodepen, FaReact} from "react-icons/fa";
import {BsDatabase} from "react-icons/bs";
import {TbSchool} from "react-icons/tb";
import {LuMonitorPlay} from "react-icons/lu";
import UnderConstruction from "@/components/UnderConstruction";


const Resume = () => {
    return (
        <section
            className="py-24 relative mt-10"
        >
            <div
                className="mx-auto max-w-7xl grid grid-cols-1 gap-8 lg:grid-cols-2 px-10"
            >
                {/* Work Experience Section* */}
                <div className="py-6">
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-cyan-50"
                    >
                        Work <span className="text-cyan-300">Experience</span>
                    </h2>
                    <div
                        className="mt-10"
                    >
                        <ResumeCard
                            Icon={FaCodepen}
                            title="Company Name"
                            role="Full-Stack Developer"
                            description="Lorem Ipsum "
                            date="from &#8211; to"
                        />
                        <ResumeCard
                            Icon={FaReact}
                            title="Company Name"
                            role="Front-End Developer"
                            description="Lorem Ipsum "
                            date="from &#8211; to"
                        />
                        <ResumeCard
                            Icon={BsDatabase}
                            title="Company Name"
                            role="Back-End Developer"
                            description="Lorem Ipsum "
                            date="from &#8211; to"
                        />
                    </div>
                </div>
                {/* Education */}
                <div className="py-6">
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-cyan-50"
                    >
                        My <span className="text-cyan-300">Education</span>
                    </h2>
                    <div
                        className="mt-10"
                    >
                        <ResumeCard
                            Icon={TbSchool}
                            title="Bunker Hill Community College"
                            role={"Computer Science A.S., \nMathematics Concentration, A.A."}
                            description="Lorem Ipsum "
                            date="from &#8211; to"
                        />
                        <ResumeCard
                            Icon={LuMonitorPlay}
                            title="Per Scholas"
                            role="AWS Certification"
                            description="Lorem Ipsum "
                            date="from &#8211; to"
                        />
                        <ResumeCard
                            Icon={LuMonitorPlay}
                            title="MSIMBO Tech Academy"
                            role="Full-Stack Developer Certification"
                            description="Lorem Ipsum "
                            date="from &#8211; to"
                        />
                    </div>
                </div>
            </div>
            <UnderConstruction/>
        </section>
    );
}
export default Resume;