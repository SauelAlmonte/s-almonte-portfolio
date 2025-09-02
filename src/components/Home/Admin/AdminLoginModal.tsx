"use client";

import { signIn } from "next-auth/react";
import { FiX, FiLock } from "react-icons/fi";
import React, { useEffect, useRef } from "react";

type AdminLoginModalProps = {
    open: boolean;
    onClose: () => void;
};

const AdminLoginModal = ({ open, onClose }: AdminLoginModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    // Close on click outside
    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="relative bg-[#181c29] rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 flex flex-col items-center"
            >
                <button
                    type="button"
                    className="absolute top-3 right-3 p-2 text-cyan-400 hover:text-cyan-200 cursor-pointer"
                    aria-label="Close modal"
                    onClick={onClose}
                >
                    <FiX size={24} />
                </button>
                <div className="flex items-center mb-4">
                    <FiLock className="text-cyan-400 mr-2 cursor-pointer" size={28} />
                    <h2 className="text-2xl font-bold text-cyan-50">Admin Login</h2>
                </div>
                <p className="text-cyan-200 mb-6 text-center">
                    Sign in with your Google account to access the admin dashboard.
                </p>
                <button
                    type="button"
                    className="flex items-center gap-3 px-6 py-3 bg-cyan-700 hover:bg-cyan-600 rounded-lg text-white font-semibold shadow transition cursor-pointer"
                    onClick={() => signIn("google", { redirectTo: "/admin" })}
                >
                    <svg
                        viewBox="0 0 48 48"
                        className="w-6 h-6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                    >
                        <g>
                            <path fill="#4285F4" d="M24 9.5c3.54 0 6.5 1.23 8.45 3.35l6.32-6.33C34.65 3.09 29.74 1 24 1 14.83 1 6.83 6.83 3.13 14.82l7.51 5.84C12.13 14.22 17.54 9.5 24 9.5z" />
                            <path fill="#34A853" d="M46.25 24.5c0-1.66-.15-3.24-.43-4.75H24v9.01h12.52c-.54 2.87-2.15 5.31-4.6 6.96l7.18 5.61C43.92 37.11 46.25 31.29 46.25 24.5z" />
                            <path fill="#FBBC05" d="M10.64 28.64A14.48 14.48 0 019.5 24c0-1.62.29-3.19.81-4.64l-7.51-5.84A23.963 23.963 0 000 24c0 3.94.95 7.66 2.64 10.91l7.56-6.27z" />
                            <path fill="#EA4335" d="M24 46.5c6.48 0 11.93-2.15 15.91-5.86l-7.57-6.27c-2.11 1.41-4.83 2.27-8.34 2.27-6.46 0-11.86-4.71-13.36-11.01l-7.52 5.84C6.82 41.16 14.83 46.5 24 46.5z" />
                        </g>
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default AdminLoginModal;
