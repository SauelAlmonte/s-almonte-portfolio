// src/constants/resume.constants.ts
import type { IconType } from 'react-icons';
import { FaCodepen, FaReact } from 'react-icons/fa';
import { BsDatabase } from 'react-icons/bs';
import { TbSchool } from 'react-icons/tb';
import { LuMonitorPlay } from 'react-icons/lu';

export type ResumeItem = {
    Icon: IconType;
    title?: string;
    role: string;
    description?: string;
    /** Display string for now; can switch to structured dates later */
    date?: string;
};

export const EXPERIENCE: ReadonlyArray<ResumeItem> = [
    {
        Icon: FaCodepen,
        title: 'Company Name',
        role: 'Full-Stack Developer',
        description: 'Lorem Ipsum ',
        date: 'from — to',
    },
    {
        Icon: FaReact,
        title: 'Company Name',
        role: 'Front-End Developer',
        description: 'Lorem Ipsum ',
        date: 'from — to',
    },
    {
        Icon: BsDatabase,
        title: 'Company Name',
        role: 'Back-End Developer',
        description: 'Lorem Ipsum ',
        date: 'from — to',
    },
] as const;

export const EDUCATION: ReadonlyArray<ResumeItem> = [
    {
        Icon: TbSchool,
        title: 'Bunker Hill Community College',
        role: 'Computer Science A.S.,\nMathematics Concentration, A.A.',
        description: 'Lorem Ipsum ',
        date: 'from — to',
    },
    {
        Icon: LuMonitorPlay,
        title: 'Per Scholas',
        role: 'AWS Certification',
        description: 'Lorem Ipsum ',
        date: 'from — to',
    },
    {
        Icon: LuMonitorPlay,
        title: 'MSIMBO Tech Academy',
        role: 'Full-Stack Developer Certification',
        description: 'Lorem Ipsum ',
        date: 'from — to',
    },
] as const;
