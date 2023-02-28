export interface ITweet {
    author: Author;
    id: number;
    parentId: null;
    userUid: string;
    imageURL: null | string;
    body: string;
    isPrivate: boolean;
    createAt: Date;
    replies: number;
    likes: number;
    likedBy: string[];
}

export interface Author {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    photoURL: string;
    disabled: boolean;
    metadata: Metadata;
    providerData: ProviderDatum[];
    tokensValidAfterTime: string;
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