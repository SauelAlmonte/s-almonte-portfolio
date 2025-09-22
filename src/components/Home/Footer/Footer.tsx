import React from "react";

import { getCopyright, TERMS_URL, PRIVACY_URL } from "@/constants/footer";

const Footer: React.FC = () => (
    <div className="mx-auto py-6 bg-[#0f142ed9]">
        <footer className="px-8 mx-auto max-w-7xl bg-transparent py-4 flex flex-col md:flex-row items-center justify-between text-zinc-400 text-sm">
            <div>{getCopyright()}</div>
            <div className="flex gap-4 mt-2 md:mt-0">
                <a href={TERMS_URL} className="hover:underline hover:text-cyan-300 transition-colors">Terms & Conditions</a>
                <a href={PRIVACY_URL} className="hover:underline hover:text-cyan-300 transition-colors">Privacy Policy</a>
            </div>
        </footer>
    </div>
);
export default Footer;