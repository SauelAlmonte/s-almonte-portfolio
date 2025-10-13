import React from 'react';
import type { IconType } from 'react-icons';

type Props = {
    title?: string;
    role: string;
    description?: string;
    Icon: IconType;
    /** Freeform like "Jan 2023 — Present". If structured later, we can render <time> tags. */
    date?: string;
};

const ResumeCard = ({ Icon, role, title, description, date }: Props) => {
    return (
        <article className="mb-6">
            <div
                className={[
                    // container / visuals
                    'rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md',
                    'shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20',
                    'transition-colors duration-300 hover:border-cyan-300 hover:bg-cyan-300/10',
                    // layout
                    'flex items-start gap-6 p-4 sm:p-8', // gap-* is RTL-safe vs space-x-*
                    // print
                    'print:bg-white print:text-black print:shadow-none print:border-zinc-200',
                ].join(' ')}
            >
                {/* Icon */}
                <div
                    aria-hidden="true"
                    className="flex items-center justify-center rounded-full bg-blue-950 w-10 h-10 sm:w-14 sm:h-14 text-cyan-50"
                >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    {/* Use h3/h4 inside lists to avoid multiple h2s on the page */}
                    {title && (
                        <h3 className="text-zinc-100 text-xl sm:text-2xl font-bold tracking-tight">
                            {title}
                        </h3>
                    )}

                    <h4 className="mt-2 text-zinc-200 text-lg font-semibold whitespace-pre-line">
                        {role}
                    </h4>

                    {description && (
                        <p className="mt-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
                            {description}
                        </p>
                    )}

                    {date && (
                        <p className="mt-2 text-zinc-200 text-sm font-light">
                            {date}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ResumeCard;
