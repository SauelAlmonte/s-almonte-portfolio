// src/constants/skills.constants.ts
export type ChartDatum = { id: string; value: number; fill: string };
export type ChartConfig = Record<string, { label: string }>;

export type SkillBlock = Readonly<{
    title: string;
    chartData: readonly ChartDatum[];
    chartConfig: ChartConfig;
}>;

// --- JavaScript / TypeScript ---
export const JS_BLOCK: SkillBlock = {
    title: 'JavaScript/TypeScript & Frameworks',
    chartData: [
        { id: 'javascript', value: 95, fill: '#0ea5e9' }, // cyan-600
        { id: 'typescript', value: 95, fill: '#06b6d4' }, // cyan-500
        { id: 'react', value: 92, fill: '#22d3ee' }, // cyan-400
        { id: 'nextjs', value: 88, fill: '#67e8f9' }, // cyan-300
    ] as const,
    chartConfig: {
        javascript: { label: 'JavaScript' },
        typescript: { label: 'TypeScript' },
        react: { label: 'React.js' },
        nextjs: { label: 'Next.js' },
    },
};

// --- Python ---
export const PY_BLOCK: SkillBlock = {
    title: 'Python & Frameworks',
    chartData: [
        { id: 'python', value: 93, fill: '#0ea5e9' },
        { id: 'django', value: 85, fill: '#06b6d4' },
        { id: 'flask', value: 75, fill: '#22d3ee' },
    ] as const,
    chartConfig: {
        python: { label: 'Python' },
        django: { label: 'Django' },
        flask: { label: 'Flask' },
    },
};

// --- Java ---
export const JAVA_BLOCK: SkillBlock = {
    title: 'Java & Frameworks',
    chartData: [
        { id: 'java', value: 90, fill: '#06b6d4' },
        { id: 'spring', value: 78, fill: '#67e8f9' },
    ] as const,
    chartConfig: {
        java: { label: 'Java' },
        spring: { label: 'Spring' },
    },
};

// --- C++ ---
export const CPP_BLOCK: SkillBlock = {
    title: 'C++ & STL',
    chartData: [
        { id: 'cpp', value: 88, fill: '#0ea5e9' },
        { id: 'stl', value: 75, fill: '#06b6d4' },
    ] as const,
    chartConfig: {
        cpp: { label: 'C++' },
        stl: { label: 'STL' },
    },
};

// Convenience export you can map over
export const SKILL_BLOCKS: readonly SkillBlock[] = [
    JS_BLOCK,
    PY_BLOCK,
    JAVA_BLOCK,
    CPP_BLOCK,
] as const;
