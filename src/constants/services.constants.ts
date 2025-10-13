// Plain data you can edit anytime
export type ServiceKey = 'uiux' | 'design' | 'apps' | 'dev';

export const SERVICES = [
    {
        id: 1,
        icon: 'uiux' as ServiceKey,
        name: 'UI & UX',
        description:
            'Ship interfaces users get on the first tap clear IA, fast flows, and WCAG-aware patterns.',
    },
    {
        id: 2,
        icon: 'design' as ServiceKey,
        name: 'Design & Creativity',
        description:
            'Brand systems and marketing visuals that look sharp and stay consistent in code.',
    },
    {
        id: 3,
        icon: 'apps' as ServiceKey,
        name: 'Web & Mobile Apps',
        description:
            'Responsive, high performance apps for web, iOS, and Android built to scale traffic, not break.',
    },
    {
        id: 4,
        icon: 'dev' as ServiceKey,
        name: 'Development',
        description:
            'Clean, reliable backends and APIs with tests, CI/CD, and observability from day one.',
    },
] as const;
