// Plain data you can edit anytime
export type ServiceKey = "uiux" | "design" | "apps" | "dev";

export const SERVICES = [
    {
        id: 1,
        icon: "uiux" as ServiceKey,
        name: "UI & UX",
        description:
            "Designing seamless and accessible interfaces that stay clear, intuitive, and highly engaging across all platforms.",
    },
    {
        id: 2,
        icon: "design" as ServiceKey,
        name: "Design & Creativity",
        description:
            "Creating bold visuals, unique branding, and fresh concepts that deliver memorable impressions.",
    },
    {
        id: 3,
        icon: "apps" as ServiceKey,
        name: "Web & Mobile Apps",
        description:
            "Developing responsive, scalable, and high-performance applications for web, iOS, and Android.",
    },
    {
        id: 4,
        icon: "dev" as ServiceKey,
        name: "Development",
        description:
            "Building secure, reliable, and scalable systems with clean code, using modern advanced frameworks.",
    },
] as const;
