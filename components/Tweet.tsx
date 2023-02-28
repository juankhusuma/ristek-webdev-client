import { app } from "@/lib/firebase";
import { TweetContext } from "@/providers/TweetProvider";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import { TfiCommentAlt, TfiPencil, TfiTrash } from "react-icons/tfi"

interface TweetProps {
    id: number;
    profileURL: string;
    username: string;
    body: string;
    createdAt: Date | string;
    imageURL?: string;
    likeCount: number;
    replyCount: number;
    userId: string;
    likedBy: string[];
    ctx: any;
}

export default function Tweet({ id, ctx, profileURL, body, createdAt, username, imageURL, likeCount, replyCount, userId, likedBy }: TweetProps) {
    const router = useRouter()
    const auth = getAuth(app)
    const [user] = useAuthState(auth)
    const { setTweets, tweets } = useContext(ctx) as any;
    const [like, setLike] = useState(likeCount)
    const [liked, setLiked] = useState(likedBy.includes(userId))

    return <div className="margin-auto w-full border border-[#ddd] p-5">
        <div className="flex items-center gap-2 text-sm font-bold">
            <img referrerPolicy="no-referrer" src={profileURL} alt="profile" className="object-cover object-center rounded-full" width={25} height={25} />
            <p>{username}</p>
        </div >
        <p className="text-xs mt-2 text-[#333]">{(new Date(createdAt)).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}</p>
        <p className="mt-3">{body}</p>
        {imageURL && <img className="max-h-[350px] object-cover object-center w-full rounded-xl" src={imageURL} alt="image" />}
        <div className="flex items-center justify-between mt-5 px-3">
            <div className="flex gap-5">
                <div className="flex items-center gap-1">
                    <p className="font-bold">{like}</p>
                    <div onClick={async () => {
                        try {
                            if (!liked) {
                                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweet/${id}/like`, {}, {
                                    headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
                                })
                                setLike(like + 1)
                                setLiked(!liked)
                            } else {
                                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tweet/${id}/like`, {
                                    headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
                                })
                                setLike(like - 1)
                                setLiked(!liked)
                            }

                        } catch (err) { console.log(err) }
                    }}>
                        {!liked ?
                            <AiOutlineLike className="font-bold cursor-pointer hover:text-blue-500" />
                            : <AiFillLike className="font-bold cursor-pointer text-blue-500" />
                        }
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <p className="font-bold">{replyCount}</p>
                    <div onClick={async () => await router.push(`/tweet/${id}`)}>
                        <TfiCommentAlt className="font-bold cursor-pointer hover:text-blue-500" onClick={() => { console.log("first") }} />
                    </div>
                </div>
            </div>
            {
                user?.uid == userId &&
                <div className="flex gap-5">
                    <TfiTrash onClick={async () => {
                        try {
                            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tweet/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${await user.getIdToken()}`
                                }
                            })
                            setTweets(tweets.filter((tweet: any) => tweet.id != id))
                        } catch (err) { console.log(err) }
                    }} className="text-red-600 cursor-pointer" />
                    <TfiPencil onClick={async () => router.push(`/tweet/${id}`)} className="text-green-600 cursor-pointer" />
                </div>
            }
        </div>

    </div >

}