export interface Itinerary {
    title: string;
    backdrop: string;
    description: string;
    activities: string;
    services: Array<String>;
    guest_type: string;
    guest_condition: string;
    price: number;
    area: string;
    tour_from: string;
    tour_to: string;
    notes: string;
    guide: object;
    is_public: boolean;
}

