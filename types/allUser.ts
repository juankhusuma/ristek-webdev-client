export interface AllUser {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    photoURL: string;
    disabled: boolean;
    metadata: Metadata;
    tokensValidAfterTime: string;
    providerData: ProviderDatum[];
}

export interface Metadata {
    lastSignInTime: string;
    creationTime: string;
    lastRefreshTime: string;
}

export interface ProviderDatum {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    providerId: string;
}