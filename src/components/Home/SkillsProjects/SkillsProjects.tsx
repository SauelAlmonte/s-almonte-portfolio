import React from "react";
import SkillsProjectsCard from "@/components/Home/SkillsProjects/SkillsProjectsCard"; // adjust path as needed

// JavaScript/TypeScript, with frameworks
const chartDataJS = [
    { id: "javascript", value: 95, fill: "#0ea5e9" },   // tailwind cyan-600
    { id: "typescript", value: 95, fill: "#06b6d4" },   // cyan-500
    { id: "react", value: 92, fill: "#22d3ee" },        // cyan-400
    { id: "nextjs", value: 88, fill: "#67e8f9" },       // cyan-300
];
const chartConfigJS = {
    javascript: { label: "JavaScript" },
    typescript: { label: "TypeScript" },
    react: { label: "React.js" },
    nextjs: { label: "Next.js" },
} as const;

// Python, with frameworks
const chartDataPython = [
    { id: "python", value: 93, fill: "#0ea5e9" },       // cyan-600
    { id: "django", value: 85, fill: "#06b6d4" },       // cyan-500
    { id: "flask", value: 75, fill: "#22d3ee" },        // cyan-400
];
const chartConfigPython = {
    python: { label: "Python" },
    django: { label: "Django" },
    flask: { label: "Flask" },
} as const;

// Java
const chartDataJava = [
    { id: "java", value: 90, fill: "#06b6d4" },         // cyan-500
    { id: "spring", value: 78, fill: "#67e8f9" },       // cyan-300
];
const chartConfigJava = {
    java: { label: "Java" },
    spring: { label: "Spring" },
} as const;

// C++
const chartDataCpp = [
    { id: "cpp", value: 88, fill: "#0ea5e9" },          // cyan-600
    { id: "stl", value: 75, fill: "#06b6d4" },          // cyan-500
];
const chartConfigCpp = {
    cpp: { label: "C++" },
    stl: { label: "STL" },
} as const;

const SkillsProjects = () => (
    <div className="py-24">
        <h2 className="text-center text-2xl md:text-4xl xl:text-5xl font-bold text-cyan-50">
            Tech Stack
            <br />
            <span className="text-cyan-300">Skills</span>{" "}
            <span className="text-3xl">&</span>{" "}
            <span className="text-cyan-300">Projects</span>
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 px-10 ">
            <SkillsProjectsCard
                title="JavaScript/TypeScript & Frameworks"
                chartData={chartDataJS}
                chartConfig={chartConfigJS}
            />
            <SkillsProjectsCard
                title="Python & Frameworks"
                chartData={chartDataPython}
                chartConfig={chartConfigPython}
            />
            <SkillsProjectsCard
                title="Java & Frameworks"
                chartData={chartDataJava}
                chartConfig={chartConfigJava}
            />
            <SkillsProjectsCard
                title="C++ & STL"
                chartData={chartDataCpp}
                chartConfig={chartConfigCpp}
            />
        </div>
    </div>
);

export default SkillsProjects;
