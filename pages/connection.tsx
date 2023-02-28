import { app } from "@/lib/firebase";
import { AllUser } from "@/types/allUser";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { TiDelete } from "react-icons/ti"
import { BsFillPlusCircleFill } from "react-icons/bs"
import { FaUserFriends } from "react-icons/fa"

export default function Connection() {
    const auth = getAuth(app)
    const [user] = useAuthState(auth)
    const [data, setData] = useState<AllUser[]>([])
    const [following, setFollowing] = useState<string[]>([])
    const [follower, setFollower] = useState<string[]>([])
    const [friend, setFriend] = useState<string[]>([])
    const [filteredData, setFilteredData] = useState<AllUser[]>(data);
    const [input, setInput] = useState("")

    useEffect(() => {
        input === "" ? setFilteredData(data) :
            setFilteredData(data.filter(d => d.displayName.toLowerCase().search(input) >= 0))
    }, [input, data])

    useEffect(() => {
        setData([]);
        setFollower([]);
        setFollowing([]);
        (async () => {
            try {
                if (user) {
                    setData((await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                        headers: { 'Authorization': `Bearer ${await user?.getIdToken()}` }
                    })).data);
                    setFollower((await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/follower`, {
                        headers: { 'Authorization': `Bearer ${await user?.getIdToken()}` }
                    })).data)
                    setFollowing((await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/following`, {
                        headers: { 'Authorization': `Bearer ${await user?.getIdToken()}` }
                    })).data)
                    setFriend((await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/friend`, {
                        headers: { 'Authorization': `Bearer ${await user?.getIdToken()}` }
                    })).data)
                }
            } catch (err) { console.log(err) }
        })()
    }, [user])

    return <div className="mt-10 w-1/2">
        <div className="p-5 border lg:text-sm text-xs border-[#ddd]">
            <h1 className="font-bold">Followers</h1>
            {(data && follower.length > 0) ?
                <ul>
                    {data
                        .filter(d => follower.includes(d.uid))
                        .map(d =>
                            <li className="my-5 flex-wrap flex justify-between items-center" key={d.uid}>
                                <li key={d.uid} className="my-5 flex-wrap lg:text-sm text-xs flex justify-between items-center">
                                    <div>
                                        <p>
                                            {d.displayName}
                                        </p>
                                        <p className="lg:text-sm text-xs text-[#444]">{d.email}</p>
                                    </div>
                                </li>

                                <TiDelete onClick={async () => {
                                    try {
                                        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/follower/${d.uid}`, {
                                            headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
                                        })
                                        setFollower(follower.filter(fol => fol != d.uid))
                                    } catch (err) { console.log(err) }
                                }} className="text-red-600 cursor-pointer text-lg" />
                            </li>
                        )
                    }
                </ul>
                : <p className="text-sm text-[#444]">You have no follower</p>}
        </div>
        <div className="p-5 lg:text-sm text-xs border border-[#ddd]">
            <h1 className="font-bold">Following</h1>
            {(data && following.length > 0) ?
                <ul className="ml-2">
                    {data
                        .filter(d => following.includes(d.uid))
                        .map(d =>
                            <li key={d.uid} className="my-5 flex flex-wrap lg:text-sm text-xs justify-between items-center">
                                <div>
                                    <p className={friend.includes(d.uid) ? "text-green-600" : ""}>
                                        {d.displayName}
                                    </p>
                                    <p className="lg:text-sm text-xs text-[#444]">{d.email}</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <TiDelete onClick={async () => {
                                        try {
                                            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/follow/${d.uid}`, {
                                                headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
                                            })
                                            setFollowing(following.filter(fol => fol != d.uid))
                                        } catch (err) { console.log(err) }
                                    }} className="text-red-600 cursor-pointer text-lg" />
                                    <FaUserFriends
                                        onClick={async () => {
                                            try {
                                                if (!friend.includes(d.uid)) {
                                                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/add-friend/${d.uid}`, {}, {
                                                        headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
                                                    })
                                                    setFriend([...friend, d.uid])
                                                } else {
                                                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/add-friend/${d.uid}`, {
                                                        headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
                                                    })
                                                    setFriend(friend.filter(f => f != d.uid))
                                                }
                                            } catch (err) { console.log(err) }
                                        }}
                                        className={`${friend.includes(d.uid) ? "text-green-600" : "text-black"} cursor-pointer text-lg`} />
                                </div>
                            </li>)
                    }
                </ul>
                : <p className="text-sm text-[#444]">You didn't follow any user</p>}
        </div>

        <div className="p-5 lg:text-sm text-xs border border-[#ddd]">
            <h1 className="font-bold text-center">All User</h1>
            <input className="px-2 py-1  w-full border border-[#ccc] mt-1" type="text" value={input} onChange={e => setInput(e.target.value)} />
            <ul className="">
                {data && filteredData.map(d =>
                    <li key={d.uid} className="my-5 flex-wrap flex lg:text-sm text-xs justify-between items-center">
                        <div>
                            <p className="lg:text-sm text-xs">
                                {d.displayName}
                            </p>
                            <p className="lg:text-sm text-xs text-[#444]">{d.email}</p>
                        </div>
                        {!(following.includes(d.uid)) && <BsFillPlusCircleFill
                            onClick={async () => {
                                try {
                                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/follow/${d.uid}`, {}, {
                                        headers: { Authorization: `Bearer ${await user?.getIdToken()}` }
                                    })
                                    setFollowing([...following, d.uid])
                                } catch (err) { console.log(err) }
                            }}
                            className="text-green-600 cursor-pointer" />}
                    </li>)}
            </ul>
        </div>

    </div>

}