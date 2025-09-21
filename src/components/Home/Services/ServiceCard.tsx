import React from "react";

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
                                        className = "",
                                    }: Props) {
    return (
        <section
            className={[
                "rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md",
                "shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20",
                "transition duration-300 hover:border-cyan-300 hover:bg-cyan-300/10",
                // let children stretch horizontally
                "flex h-full max-w-sm flex-col items-center text-center sm:text-left sm:items-start",
                "p-6",
                className,
            ].join(" ")}
        >
            {/* icon (center it without affecting child stretch) */}
                <div className="" aria-hidden="true">
                    <div className="[&>svg]:h-10 [&>svg]:w-10 sm:[&>svg]:h-11 sm:[&>svg]:w-11 [&>svg]:fill-cyan-500">
                        {icon}
                    </div>
                </div>

                {/* title */}
                <h2 className="mt-4 font-bold text-zinc-200 text-balance text-base sm:text-lg md:text-xl">
                    {name}
                </h2>

                {/* description – fills full card width now */}
                <p className="mt-2 text-zinc-300 text-wrap text-sm sm:text-base font-normal leading-5.5 tracking-wide ">
                    {description}
                </p>
        </section>
    );
}
