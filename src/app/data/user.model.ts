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

export interface Profile {
    fname: string;
    tagline: string;
    profile_type: string;
    interests: {
        wrapperName: string;
        values: Array<any>;
        type: string;
    };
    lifestyle: {
        wrapperName: string;
        values: Array<any>;
        type: string;
    };
    profile_id: string;
    address: string;
    lname: string;
    image_url: string;
}

export interface Profile_ {
    fname: string;
    tagline: string;
    profile_type: string;
    interests: Array<string>;
    lifestyle: Array<string>;
    userId: string;
    address: string;
    lname: string;
    image_url: string;
}

export interface FederatedUserModel {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
}
