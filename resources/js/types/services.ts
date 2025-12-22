export interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    icon?: string;
    image?: string;
    features?: string[];
    price?: number;
    price_text?: string;
    duration?: string;
    is_featured: boolean;
}

export interface ServicePageProps {
    services: Service[];
    statistics?: {
        total_services: number;
        services: Service[];
    };
}