"use client"


import Link from "next/link" 
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase" 

export default function Navbar() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })
    }, [])

    return (
        <nav className="flex justify-between items-center p-4 bg-black text-white">
            {}
            <Link href="/">
                <h1 className="text-xl font-bold">Tienda</h1>
            </Link>

            <div className="flex gap-4">
                {!user && (
                    <>
                        {}
                        <Link href="/login">Iniciar sesión</Link>
                        <Link href="/register">Crear cuenta</Link>
                    </>
                )}

                {user && (
                    <Link href="/user">Mi cuenta</Link>
                )}
            </div>
        </nav>
    )
}
