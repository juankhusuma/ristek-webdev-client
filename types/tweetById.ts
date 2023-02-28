export interface TweetByID {
    author: Author;
    likedBy: string[];
    likeCount: number;
    replyCount: number;
    replies: Tweet[];
    parent?: Tweet;
    id: number;
    parentId: null;
    imageURL?: string;
    body: string;
    isPrivate: boolean;
    createAt: Date;
}

export interface Author {
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

export interface Tweet {
    id: number;
    author: Author;
    likedBy: string[];
    likeCount: number;
    replyCount: number;
    body: string;
    imageURL?: string;
    createAt: Date;
}
