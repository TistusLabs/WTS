export interface Itinerary {
    title: string;
    backdrop: string;
    description: string;
    activities: string;
    services: Array<String>;
    guest_type: string;
    condition: string;
    price: number;
    area: string;
    from: string;
    to: string;
    notes: string;
    guide: object;
    is_public: boolean;
}

