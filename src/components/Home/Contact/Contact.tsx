import React from "react";
import { BiMap } from "react-icons/bi";
import SocialIcons from "@/components/Home/Hero/SocialIcons";

const Contact = () => {
    return (
        <div className="py-16">
            <h2
                className="text-center text-2xl md:text-4xl xl:text-5xl font-bold text-zinc-50 mb-4"
            >
                Let&#39;s <span className="text-cyan-300">Connect</span>
            </h2>
            <div className=" max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch">
                {/* Left Card */}
                <div className="p-8">
                    <div className="p-8 h-full flex flex-col bg-white/5 rounded-xl">
                        <h2 className="text-left text-lg lg:text-2xl xl:text-3xl text-pretty font-bold text-zinc-50">
                            Let&#39;s Talk&#44; <span className="text-cyan-300">Book a Time</span>
                            <br />
                            and See If I&#39;m the <span className="text-cyan-300">Right Fit</span>
                        </h2>
                        <p className=" text-zinc-200 text-left text-base sm:text-left text-pretty mt-3 w-5/6 sm:w-full lg:w-5/6">
                            Reach out to me today and let’s discuss how I can help you achieve your goals.
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center space-x-2 mb-1">
                                <BiMap className="text-left w-9 h-9 text-cyan-300" />
                                <p>Boston, MA</p>
                            </div>
                            <div>
                                <SocialIcons />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Card (Form) */}
                <div className="p-8">
                    <div className="p-8 h-full flex flex-col bg-white/5 rounded-xl">
                        <form className="max-w-md mx-auto w-full">
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="floating_first_name"
                                        id="floating_first_name"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_first_name"
                                        className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        First name
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="floating_last_name"
                                        id="floating_last_name"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_last_name"
                                        className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Last name
                                    </label>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="tel"
                                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                        name="floating_phone"
                                        id="floating_phone"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400 "
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_phone"
                                        className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Phone number
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="floating_company"
                                        id="floating_company"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_company"
                                        className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Company
                                    </label>
                                </div>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="email"
                                    name="floating_email"
                                    id="floating_email"
                                    className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="floating_email"
                                    className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Email address
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="mt-8 text-white bg-cyan-700 hover:cursor-pointer hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Contact;
