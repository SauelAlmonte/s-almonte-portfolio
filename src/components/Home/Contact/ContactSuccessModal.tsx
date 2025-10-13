'use client';

import React from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ContactSuccessModal({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            className="fixed inset-0 z-[1000] flex items-center justify-center"
        >
            {/* Backdrop */}
            <button
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/60"
            />

            {/* Card */}
            <div className="relative w-[92vw] max-w-lg rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md shadow-xl shadow-cyan-500/10 p-6 sm:p-8">
                <div className="flex items-start gap-3">
                    <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-300/10">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            className="fill-cyan-300"
                        >
                            <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h3
                            id="contact-success-title"
                            className="text-zinc-50 text-2xl sm:text-3xl font-bold"
                        >
                            Message received!
                        </h3>
                        <p className="mt-2 text-zinc-300">
                            Thanks for reaching out. I’ll reply to the email you
                            provided. If it’s urgent, use any social link below.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={onClose}
                                className="inline-flex items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-cyan-50 hover:bg-cyan-500/20 transition"
                            >
                                Close
                            </button>
                            <a
                                href="/#contact"
                                className="inline-flex items-center justify-center rounded-lg border border-zinc-600/40 px-4 py-2 text-zinc-200 hover:bg-white/5 transition"
                            >
                                Send another message
                            </a>
                        </div>

                        <p className="mt-6 text-xs text-zinc-400">
                            Tip: Check your spam folder if you don’t see a reply
                            soon.
                        </p>
                    </div>
                </div>

                {/* X button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 rounded-md p-2 text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.3z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
