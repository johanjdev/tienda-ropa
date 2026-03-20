"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

interface Producto {
  id_producto: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  id_categoria: number
  estado: string
  imagen_url: string
}

interface Categoria {
  id_categoria: number
  nombre_categoria: string
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [imagenEditando, setImagenEditando] = useState<File | null>(null)

  // 🔎 BUSQUEDA
  const [busqueda, setBusqueda] = useState("")

  // Crear
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoria, setCategoria] = useState<number | "">("")
  const [estado, setEstado] = useState("activo")
  const [imagen, setImagen] = useState<File | null>(null)

  // Obtener productos
  const fetchProductos = async () => {
    const { data } = await supabase.from("productos").select("*")
    if (data) setProductos(data)
  }

  // Obtener categorías
  const fetchCategorias = async () => {
    const { data } = await supabase.from("categorias").select("*")
    if (data) setCategorias(data)
  }

  useEffect(() => {
    fetchProductos()
    fetchCategorias()
  }, [])

  // Subir imagen
  const subirImagen = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("productos")
      .upload(fileName, file)

    if (error) {
      alert("Error subiendo imagen")
      return null
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // Crear producto
  const crearProducto = async () => {
    if (!nombre || !descripcion || !precio || !categoria) {
      alert("Completa todos los campos")
      return
    }

    let imageUrl = ""

    if (imagen) {
      const url = await subirImagen(imagen)
      if (url) imageUrl = url
    }

    await supabase.from("productos").insert([
      {
        nombre,
        descripcion,
        precio: Number(precio),
        stock: 10,
        id_categoria: Number(categoria),
        estado,
        imagen_url: imageUrl,
      },
    ])

    setNombre("")
    setDescripcion("")
    setPrecio("")
    setCategoria("")
    setEstado("activo")
    setImagen(null)

    fetchProductos()
  }

  // Actualizar producto
  const actualizarProducto = async (producto: Producto, nuevaImagen?: File) => {
    let imageUrl = producto.imagen_url

    if (nuevaImagen) {
      const url = await subirImagen(nuevaImagen)
      if (url) imageUrl = url
    }

    await supabase
      .from("productos")
      .update({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        id_categoria: producto.id_categoria,
        estado: producto.estado,
        imagen_url: imageUrl,
      })
      .eq("id_producto", producto.id_producto)

    setEditando(null)
    fetchProductos()
  }

  // Eliminar producto
  const eliminarProducto = async (id: number) => {
    await supabase.from("productos").delete().eq("id_producto", id)
    fetchProductos()
  }

  //BUSQUEDA
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Productos</h1>

      {/* 🔎 BUSCADOR */}
      <div className="mb-8 flex items-center gap-2">
        <span className="text-xl">😑</span>
        <input
          type="text"
          placeholder="Buscar producto..."
          className="border p-2 w-full"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* ================= CREAR ================= */}
      <div className="border p-6 mb-10 rounded grid gap-4">
        <h2 className="text-xl font-semibold">Agregar Producto</h2>

        <input
          className="border p-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          className="border p-2"
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <select
          className="border p-2"
          value={categoria}
          onChange={(e) => setCategoria(Number(e.target.value))}
        >
          <option value="categoria">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="activo">Disponible</option>
          <option value="inactivo">No disponible</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImagen(e.target.files ? e.target.files[0] : null)
          }
        />

        <button
          onClick={crearProducto}
          className="bg-blue-600 text-white py-2 rounded"
        >
          Crear Producto
        </button>
      </div>

      {/* ================= LISTA ================= */}
      <div className="grid gap-6">
        {productosFiltrados.map((producto) => (
          <div key={producto.id_producto} className="border p-6 rounded">

            {editando === producto.id_producto ? (
              <div className="grid gap-3">

                <input
                  className="border p-2"
                  value={producto.nombre}
                  onChange={(e) =>
                    setProductos((prev) =>
                      prev.map((p) =>
                        p.id_producto === producto.id_producto
                          ? { ...p, nombre: e.target.value }
                          : p
                      )
                    )
                  }
                />

                <input
                  className="border p-2"
                  value={producto.descripcion}
                  onChange={(e) =>
                    setProductos((prev) =>
                      prev.map((p) =>
                        p.id_producto === producto.id_producto
                          ? { ...p, descripcion: e.target.value }
                          : p
                      )
                    )
                  }
                />

                <input
                  type="number"
                  step="0.01"
                  className="border p-2"
                  value={producto.precio}
                  onChange={(e) =>
                    setProductos((prev) =>
                      prev.map((p) =>
                        p.id_producto === producto.id_producto
                          ? { ...p, precio: Number(e.target.value) }
                          : p
                      )
                    )
                  }
                />

                <select
                  className="border p-2"
                  value={producto.id_categoria}
                  onChange={(e) =>
                    setProductos((prev) =>
                      prev.map((p) =>
                        p.id_producto === producto.id_producto
                          ? {
                              ...p,
                              id_categoria: Number(e.target.value),
                            }
                          : p
                      )
                    )
                  }
                >
                  {categorias.map((cat) => (
                    <option
                      key={cat.id_categoria}
                      value={cat.id_categoria}
                    >
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>

                <select
                  className="border p-2"
                  value={producto.estado}
                  onChange={(e) =>
                    setProductos((prev) =>
                      prev.map((p) =>
                        p.id_producto === producto.id_producto
                          ? { ...p, estado: e.target.value }
                          : p
                      )
                    )
                  }
                >
                  <option value="activo">Disponible</option>
                  <option value="inactivo">No disponible</option>
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImagenEditando(e.target.files ? e.target.files[0] : null)
                  }
                />

                <button
                  onClick={() => actualizarProducto(producto, imagenEditando)}
                  className="bg-green-600 text-white py-2 rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            ) : (
              <div>
                {producto.imagen_url && (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-40 mb-4"
                  />
                )}

                <h2 className="text-lg font-semibold">
                  {producto.nombre}
                </h2>

                <p>{producto.descripcion}</p>

                <p>${producto.precio.toFixed(2)}</p>

                <p>
                  Estado:{" "}
                  {producto.estado === "activo"
                    ? "Disponible"
                    : "No disponible"}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setEditando(producto.id_producto)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarProducto(producto.id_producto)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}