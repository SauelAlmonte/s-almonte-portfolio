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
                "flex h-full flex-col items-stretch text-center",
                "p-6",
                className,
            ].join(" ")}
        >
            {/* icon (center it without affecting child stretch) */}
            <div className="mx-auto" aria-hidden="true">
                <div className="[&>svg]:h-12 [&>svg]:w-12 [&>svg]:fill-cyan-500">
                    {icon}
                </div>
            </div>

            {/* title */}
            <h2 className="mt-4 self-stretch font-semibold text-cyan-50 text-balance text-sm sm:text-lg">
                {name}
            </h2>

            {/* description – fills full card width now */}
            <p className="mt-2 self-stretch text-cyan-50 leading-[1.6] text-balance text-sm sm:text-base">
                {description}
            </p>
        </section>
    );
}
