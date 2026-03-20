"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Login(){

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const handleLogin = async(e)=>{
    e.preventDefault()

    const {data,error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error){
      alert(error.message)
      return
    }

    alert("Login correcto")
  }

  return(
    <div style={{width:"400px",margin:"auto",marginTop:"100px"}}>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button>Ingresar</button>

      </form>

    </div>
  )
}