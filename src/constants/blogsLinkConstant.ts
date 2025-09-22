export interface BlogLink {
    image: string;
    title: string;
    date: string;
    href: string;
    tags?: string[];
}

export const blogLinks: BlogLink[] = [
    {
        image: "/images/b1.jpg",
        title: "Learn how to build an amazing portfolio website using next js",
        date: "Date",
        href: "#portfolio", // unique
        tags: ["React.js", "Next.js", "Tailwind CSS"],
    },
    {
        image: "/images/b2.jpg",
        title: "Learn how to build an amazing Blog website using next js",
        date: "Date",
        href: "#blog", // unique
        tags: ["React.js", "Next.js", "Tailwind CSS"],
    },
    {
        image: "/images/b3.jpg",
        title: "Learn how to build an amazing Social Media website using next js",
        date: "Date",
        href: "#socialmedia", // unique
        tags: ["React.js", "Next.js", "Tailwind CSS"],
    },
    {
        image: "/images/b2.jpg",
        title: "Learn how to build an amazing Blog website using next js",
        date: "Date",
        href: "#other", // unique
        tags: ["React.js", "Next.js", "Tailwind CSS"],
    },
];
