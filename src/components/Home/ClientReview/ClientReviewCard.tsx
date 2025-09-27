import React from "react";
import Image from "next/image";

type Props = {
    image: string;
    name: string;
    role: string;
}

const ClientReviewCard = ({image, name, role}: Props) => {
    return (
        <div
            className="mt-2 rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md p-6
                shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 transition duration-300 hover:border-cyan-300 hover:bg-cyan-300/10
                m-2
            "
        >
            <Image
                className="rounded-full border border-cyan-400/30 backdrop-blur-md shadow-xl shadow-cyan-500/10"
                src={image}
                alt="client"
                width={60}
                height={60}
            />
            <div
                className="flex flex-col gap-1 mt-2 text-left  py-1"
            >
                <h3
                    className="text-base font-bold text-zinc-100"
                >
                    {name}
                </h3>
                <p
                    className="text-sm italic font-semibold text-zinc-200"
                >
                    {role}
                </p>
                <p
                    className="mt-2 text-base text-zinc-300 font-medium"
                >
                    &#8220;Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam sint mollitia similique
                    blanditiis nemo, praesentium provident et a hic quam.&#8221;
                </p>
            </div>
        </div>
    )
}
export default ClientReviewCard;