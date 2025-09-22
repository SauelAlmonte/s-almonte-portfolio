import React from "react";
import Image from "next/image";

type Props = {
    image: string;
    title: string;
    date?: string;
    href: string;
    tags?: string[];
}

const BlogsCard = ({image, title, date, href, tags} : Props) => {
    return (
        <div className="h-full flex flex-col rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md p-6 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 transition duration-300 m-2">
            <div className="relative w-full h-52 rounded-lg overflow-hidden">
                <Image
                    src={image}
                    alt="blogs"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                />
            </div>
            {date && (
                <p className="mt-4 text-zinc-200 w-fit text-base font-medium italic ">
                    {date}
                </p>
            )}
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
            >
                <h2 className="text-zinc-50 font-bold text-sm sm:text-base mt-2 hover:underline hover:cursor-pointer hover:text-cyan-400
                transition-all duration-300"
                >
                    {title}
                </h2>
            </a>
            <div className="mt-4 flex gap-2 items-center">
                {(tags ?? []).map((tag: string) => (
                    <p
                        key={tag}
                        className="px-4 py-1.5 bg-blue-950 text-zinc-50 text-sm font-semibold rounded-full"
                    >
                        {tag}
                    </p>
                ))}

            </div>
        </div>
    )
}

export default BlogsCard;