"use client"

import link from "next/link"
import { useEffect, useState } from "react"
import { createclient } from  "../lib/supabase"
import { createClient } from "@supabase/supabase-js"

export default function Navbar() {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })
    }, [])

    return (
        <nav className="flex justify-between items-center p-4 bg-black text-white">

            <link href="/">
                <h1 className="text-xl font-bold">Tienda</h1>
            </link>

            <div className="flex gap-4">
                {!user && (
                    <>
                        <link href="/login" >Iniciar sesion</link>
                        <link href="/register">Crear cuenta</link>
                    </>
                )}

                {user && (
                    <link href="/user">Mi cuenta</link>
                )}
            </div>
        </nav>
    )
}