"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Register(){

  const [nombre,setNombre]=useState("")
  const [email,setEmail]=useState("")
  const [telefono,setTelefono]=useState("")
  const [direccion,setDireccion]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)

  const handleRegister = async (e)=>{
    e.preventDefault()

    if(loading) return
    setLoading(true)

    // 1 crear usuario en auth
    const {data,error} = await supabase.auth.signUp({
      email,
      password
    })

    if(error){
      alert(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    // 2 guardar datos en tabla usuarios
    const {error:dbError} = await supabase
    .from("usuarios")
    .insert({
      nombre,
      email,
      telefono,
      direccion,
      auth_id: user.id
    })

    if(dbError){
      alert(dbError.message)
      setLoading(false)
      return
    }

    alert("Usuario registrado correctamente")

    // limpiar formulario
    setNombre("")
    setEmail("")
    setTelefono("")
    setDireccion("")
    setPassword("")

    setLoading(false)
  }

  return(
    <div style={{width:"400px",margin:"auto",marginTop:"100px"}}>

      <h2>Registro</h2>

      <form onSubmit={handleRegister}>

        <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e)=>setNombre(e.target.value)}
        />

        <br/><br/>

        <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
        placeholder="Telefono"
        value={telefono}
        onChange={(e)=>setTelefono(e.target.value)}
        />

        <br/><br/>

        <input
        placeholder="Dirección"
        value={direccion}
        onChange={(e)=>setDireccion(e.target.value)}
        />

        <br/><br/>

        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

      </form>

    </div>
  )
}