import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth"
import Link from "next/link";
import { useAuthState, useSignInWithGoogle, useSignOut } from "react-firebase-hooks/auth";
import Hover from "./Hover";
import axios from "axios";
import { BiMessageAltDetail } from "react-icons/bi"
import { FaUserFriends } from "react-icons/fa"
import { GrLogin, GrLogout } from "react-icons/gr"
import { useEffect } from "react";

export default function Navbar() {
    const auth = getAuth(app);
    const [user] = useAuthState(auth);
    const [signInWIthGoogle] = useSignInWithGoogle(auth);
    const [signOut] = useSignOut(auth);

    useEffect(() => {
        (async () =>
            user &&
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {}, {
                headers: {
                    "Authorization": `Bearer ${await (user as any).getIdToken()}`
                }
            })
        )()
    }, [user])

    return <nav className="fixed flex flex-col items-center w-1/6 h-full px-5 py-5 text-lg font-semibold bg-white shadow-lg gap-y-10">
        <h1 className="text-xl font-bold">
            <Link href="/">
                <span className="text-[#5038bc]">RI</span>
                <span className="text-[#333] lg:inline-block hidden">TWEET</span>
            </Link>
        </h1>
        <ul className="flex-col flex items-center w-full justify-center text-[#565656] lg:items-start gap-4 ">
            <li className="text-base">
                <Link href="/">
                    <div className="flex items-center justify-center gap-2">
                        <BiMessageAltDetail />
                        <div className="hidden lg:inline-block">
                            <Hover>Tweet</Hover>
                        </div>
                    </div>
                </Link></li>
            <li className="text-base">
                <Link href="/connection">
                    <div className="flex items-center justify-center gap-2">
                        <FaUserFriends />
                        <div className="hidden lg:inline-block">
                            <Hover>Connections</Hover>
                        </div>
                    </div>
                </Link></li>
            <li className="text-base">{user ?
                <button className="flex items-center justify-center gap-2" onClick={async () => await signOut()}>
                    <GrLogout />
                    <div className="hidden lg:inline-block">
                        <Hover> Sign Out</Hover>
                    </div>
                </button> :
                <button className="flex items-center justify-center gap-4" onClick={async () => {
                    try {
                        await signInWIthGoogle()
                    } catch (err) {
                        console.error(err);
                    }
                }}>
                    <GrLogin />
                    <div className="hidden lg:inline-block">
                        <Hover> Sign In</Hover>
                    </div>
                </button>
            }</li>
        </ul>
    </nav>
}