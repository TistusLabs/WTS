export interface User {
    first_name: string;
    last_name: string;
    address: string;
    interests: string;
    lifestyle: string;
    isVerified: boolean;
}

export interface AuthUser {
    email: string;
    password: string;
    mobile: string;
}