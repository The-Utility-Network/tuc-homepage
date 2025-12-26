import { Metadata, MetadataRoute } from 'next';
import { INDUSTRIES, LOCATIONS, COMPARISONS } from '@/data/seo';
import { CODEX } from '@/data/codex';

const BASE_URL = 'https://theutilitycompany.co';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/about',
        '/contact',
        '/industries',
        '/locations',
        '/comparisons',
        '/codex',
        '/podcast',
        '/shop',
        '/publications',
        '/portal',
        '/reserve',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    }));

    const industryRoutes = INDUSTRIES.map((ind) => ({
        url: `${BASE_URL}/industries/${ind.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const locationRoutes = LOCATIONS.map((loc) => ({
        url: `${BASE_URL}/locations/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const comparisonRoutes = COMPARISONS.map((comp) => ({
        url: `${BASE_URL}/comparisons/${comp.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const codexRoutes = CODEX.map((term) => ({
        url: `${BASE_URL}/codex/${term.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [
        ...routes,
        ...industryRoutes,
        ...locationRoutes,
        ...comparisonRoutes,
        ...codexRoutes,
    ];
}
