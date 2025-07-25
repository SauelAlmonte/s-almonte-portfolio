import Image from "next/image";
import "./globals.css";

export default function Home() {
    return (
        <main className="home-page">
            <div className="responsive-image">
                <Image
                    src="/under-construction.jpg"
                    alt="Under Construction"
                    fill
                    priority
                />
            </div>

            <p className="tech-info">
                Currently updating portfolio using Next.js, TypeScript, TailwindCSS, and Framer Motion.
            </p>

            <a
                href="https://www.linkedin.com/in/sauel-almonte/"
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-link"
            >
                Connect with me on LinkedIn
            </a>
        </main>
    );
}
