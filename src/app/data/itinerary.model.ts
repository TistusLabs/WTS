export interface Itinerary {
    title: string;
    backdrop: string;
    description: string;
    activities: string;
    services: Array<String>;
    guest_type: string;
    guest_condition: string;
    price_child: number;
    price_adult: number;
    area: string;
    tour_from: string;
    tour_to: string;
    tour_duration: string;
    notes: string;
    guide: object;
    is_public: boolean;
}

