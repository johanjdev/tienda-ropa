"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link";


interface Producto {
  id_producto: number
  nombre: string
  descripcion: string
  precio: number
  imagen_url: string
}



export default function Catalogo() {

  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("estado", "activo")
        .order("id_producto", { ascending: false })

      if (!error && data) {
        setProductos(data)
      }

      setLoading(false)
    }

    fetchProductos()
  }, [])

  if (loading) return <p>Cargando productos...</p>

  return (
    <div>
      <Link href="/admin/dashboard">
        Ir al Dashboard Admin
      </Link>


      <h2 className="text-3xl font-bold mb-8">
        Catálogo
      </h2>

      {productos.length === 0 && (
        <p>No hay productos disponibles</p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id_producto}
            className="border rounded p-4 hover:shadow-lg transition"
          >
            {producto.imagen_url && (
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="h-48 w-full object-cover mb-3"
              />
            )}

            <h3 className="font-semibold text-lg">
              {producto.nombre}
            </h3>

            <p className="text-gray-600 text-sm mb-2">
              {producto.descripcion}
            </p>

            <p className="font-bold text-xl">
              ${producto.precio.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}