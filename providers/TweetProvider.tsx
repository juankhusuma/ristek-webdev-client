import { ITweet } from "@/types/tweet";
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

interface ITweetContext {
    tweets: ITweet[];
    setTweets: Dispatch<SetStateAction<ITweet[]>> | (() => any);
}

export const TweetContext = createContext<ITweetContext>({
    tweets: [],
    setTweets: () => { }
})
export default function TweetProvider(props: { children: ReactNode, value: ITweetContext }) {
    return <TweetContext.Provider value={props.value}>
        {props.children}
    </TweetContext.Provider>
}