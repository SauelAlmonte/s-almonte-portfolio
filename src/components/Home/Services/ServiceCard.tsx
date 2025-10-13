import React from 'react';

type Props = Readonly<{
    icon: React.ReactNode;
    name: string;
    description: string;
    className?: string;
}>;

export default function ServiceCard({
    icon,
    name,
    description,
    className = '',
}: Props) {
    return (
        <article
            className={[
                // container
                'h-full rounded-2xl border bg-white/5 backdrop-blur-sm',
                'border-cyan-500/10 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]',
                // interaction
                'transition-colors duration-300',
                'hover:border-cyan-300/30 hover:bg-cyan-300/5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60',
                // layout
                'flex flex-col items-center sm:items-start text-center sm:text-left',
                'p-6 hover:shadow-cyan-400/25',
                className,
            ].join(' ')}
        >
            {/* Icon */}
            <div aria-hidden="true" className="text-cyan-300">
                <div className="[&>svg]:h-10 [&>svg]:w-10 sm:[&>svg]:h-11 sm:[&>svg]:w-11 [&>svg]:fill-current">
                    {icon}
                </div>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg md:text-xl lg:text-[22px] font-semibold tracking-tight text-zinc-100">
                {name}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-zinc-300 max-w-[36ch] lg:max-w-[40ch]">
                {description}
            </p>
        </article>
    );
}
