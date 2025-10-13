// No 'use client' needed—no hooks
import React from 'react';
import { BiMap } from 'react-icons/bi';
import SocialIcons from '@/components/Home/Hero/SocialIcons';

const Contact = () => {
    return (
        <section
            id="contact"
            className="flex flex-col items-center justify-center py-24 min-h-dvh"
        >
            <h2 className="text-center text-2xl md:text-3xl xl:text-4xl mt-4 pretty font-bold text-zinc-50 mb-4">
                Let&#39;s <span className="text-cyan-300">Connect</span>
            </h2>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center justify-center">
                {/* Left Card */}
                <div className="p-8">
                    <div className="p-8 h-full flex flex-col">
                        <h2 className="text-left text-2xl md:text-3xl xl:text-4xl mt-4 pretty font-bold text-zinc-50">
                            Let&#39;s Talk&#44;{' '}
                            <span className="text-cyan-300">Book a Time</span>
                            <br />
                            and See If I&#39;m the{' '}
                            <span className="text-cyan-300">Right Fit</span>
                        </h2>
                        <p className="text-zinc-200 text-left text-base text-pretty mt-3 w-5/6 sm:w/full lg:w-5/6">
                            Reach out to me today and let’s discuss how I can
                            help you achieve your goals.
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center space-x-2 mb-1">
                                <BiMap className="text-left w-9 h-9 text-cyan-300" />
                                <p>Boston, MA</p>
                            </div>
                            <SocialIcons />
                        </div>
                    </div>
                </div>

                {/* Right Card (Form) */}
                <div className="p-8">
                    <div className="p-8 h-full flex flex-col rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 transition duration-300 m-2 autofill-fix">
                        <form
                            className="max-w-md mx-auto w-full"
                            action="https://formsubmit.co/almontesauel@gmail.com"
                            method="POST"
                            target="_self"
                            acceptCharset="UTF-8"
                        >
                            {/* FormSubmit options */}
                            <input
                                type="hidden"
                                name="_subject"
                                value="New contact from s-almonte.vercel.app"
                            />
                            <input
                                type="hidden"
                                name="_template"
                                value="table"
                            />
                            <input
                                type="hidden"
                                name="_captcha"
                                value="false"
                            />
                            {/* Redirect back to homepage + open success modal + scroll to contact */}
                            <input
                                type="hidden"
                                name="_next"
                                value="https://s-almonte.vercel.app/?sent=1#contact"
                            />
                            {/* Optional autoresponse to the sender */}
                            <input
                                type="hidden"
                                name="_autoresponse"
                                value="Thanks for reaching out — I’ll get back to you shortly."
                            />
                            {/* Honeypot */}
                            <input
                                type="text"
                                name="_honey"
                                className="hidden"
                                tabIndex={-1}
                                autoComplete="off"
                            />

                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="firstName"
                                        className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        First name
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="lastName"
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
                                        name="phone"
                                        id="phone"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400 "
                                        placeholder=" "
                                        inputMode="tel"
                                    />
                                    <label
                                        htmlFor="phone"
                                        className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Phone number
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="company"
                                        id="company"
                                        className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="company"
                                        className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Company
                                    </label>
                                </div>
                            </div>

                            {/* IMPORTANT: name must be `email` so Reply-To works */}
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-zinc-400"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Email address
                                </label>
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <textarea
                                    name="message"
                                    id="message"
                                    rows={5}
                                    className="block py-2.5 px-0 w-full text-sm text-zinc-50 bg-transparent border-0 border-b-2 border-zinc-700 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-300 peer placeholder:text-transparent resize-y"
                                    placeholder=" "
                                    required
                                    spellCheck={true}
                                    autoComplete="off"
                                    aria-label="Message"
                                />
                                <label
                                    htmlFor="message"
                                    className="absolute text-sm text-zinc-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                    peer-focus:left-0 peer-focus:text-cyan-300
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Message
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
        </section>
    );
};

export default Contact;
