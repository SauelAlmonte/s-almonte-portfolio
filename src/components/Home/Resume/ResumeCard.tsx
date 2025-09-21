import React from "react";
import { IconType } from "react-icons";

type Props = {
    title?: string;
    role: string;
    description?: string;
    Icon: IconType;
    date?: string;
};

const ResumeCard = ({ Icon, role, title, description, date }: Props) => {
    return (
        <div className="mb-6">
            <div className="flex items-start space-x-6 transition-all duration-300 p-4 sm:p-8 rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:border-cyan-300 hover:bg-cyan-300/10">
                <div className="sm:w-14 sm:h-14 w-10 h-10 bg-blue-950 rounded-full flex items-center justify-center flex-col">
                    <Icon className="sm:w-8 sm:h-8 w-6 h-6 text-cyan-50" />
                </div>
                <div className="flex-1">
                    <h2 className="text-zinc-100 text-xl sm:text-2xl font-bold">
                        {title}
                    </h2>
                    <h3 className="mt-2 text-zinc-200 text-lg font-semibold">
                        {role.split('\n').map((line, idx, arr) => (
                            <React.Fragment key={idx}>
                                {line}
                                {idx !== arr.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </h3>
                    <p className="text-zinc-300 text-sm sm:text-base pt-3">
                        {description}
                    </p>
                    {date && (
                        <h2 className="mt-2 text-zinc-200 w-fit text-sm font-light ">
                            {date}
                        </h2>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ResumeCard;
