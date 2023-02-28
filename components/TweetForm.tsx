import { app } from "@/lib/firebase";
import { TweetContext } from "@/providers/TweetProvider";
import { ITweet } from "@/types/tweet";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUploadFile } from "react-firebase-hooks/storage";

export default function TweetForm({ ctx }: any) {
    const [tweet, setBody] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [file, setFile] = useState<File | null>()
    const [uploadFile] = useUploadFile();
    const storage = getStorage(app)
    const [posting, setPosting] = useState(false)
    const auth = getAuth(app)
    const [user] = useAuthState(auth)
    const { setTweets, tweets } = useContext(ctx) as any
    const router = useRouter()
    const id = router.query["id"] || null

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            setPosting(true)
            var link: string | null = null;
            if (file) {
                console.log("sending file")
                const storageRef = ref(storage, `tweet/${user?.uid}_${Date.now()}_${file.name}`)
                const result = await uploadFile(storageRef, file, {
                    contentType: 'image/jpeg'
                })
                if (result) {
                    link = (await getDownloadURL(result?.ref));
                }
            }
            try {
                console.log(link)
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweet`, {
                    imageURL: link,
                    body: tweet,
                    isPrivate,
                    ...(id ? {
                        parent: {
                            connect: {
                                id: +id
                            }
                        },
                    } : {}),
                }, { headers: { "Authorization": `Bearer ${await user?.getIdToken()}` } })
                console.log(res.data)
                setTweets([res.data as ITweet, ...tweets])
            } catch (err) { console.log(err) }
            finally {
                setPosting(false)
                setBody("")
                setFile(null)
                setIsPrivate(false)
            }
        }} className='bg-[#eee] p-5 lg:p-10 mt-10 rounded-xl shadow-xl'>
            <h1 className='text-xl mb-2 font-bold text-[#5038bc]'>Welcome,</h1>
            <div className='flex gap-2 items-center font-bold text-[#444]'>
                <img referrerPolicy="no-referrer" className='object-cover object-center rounded-full' src={user?.photoURL as string} alt="" width={25} height={25} />
                <p>{user?.displayName}</p>
            </div>
            <textarea value={tweet} onChange={e => setBody(e.target.value)} className='mt-5 w-full px-2 lg:px-5 py-3 rounded-lg bg-[#ddd]' placeholder='Tweet something...' name="body" />
            <p className={`lg:text-sm text-xs float-right font-bold ${tweet.length > 1024 ? 'text-red-500' : 'text-blue-500'}`}>{tweet.length}/1024</p>
            <div className='flex flex-col lg:flex-row items-center justify-between w-full mt-10'>
                <div>
                    <div className="">
                        <input className="mr-2" value={`${isPrivate}`} onChange={e => { setIsPrivate(!isPrivate) }} type="checkbox" name="isPrivate" />
                        <label htmlFor="isPrivate" className='lg:text-sm text-xs font-bold uppercase'>Private</label>
                    </div>
                    <div>
                        <input className='w-[200px]  text-xs lg:text-sm text-[#333]' type="file" accept='image/*' name="file" onChange={async (e) => {
                            setFile(e?.target?.files?.[0] as File)
                        }} />
                    </div>
                </div>
                <input type="submit" value={!posting ? "Tweet" : "Posting..."} className='mt-3 cursor-pointer lg:text-base text-sm text-[#eee] font-bold px-5 py-2 rounded-full relative right-0 bg-[#5038bc]' />
            </div>
        </form>
    )
}