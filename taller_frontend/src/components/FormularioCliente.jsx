import { useState, useEffect } from 'react'
import axios from 'axios'

function FormularioCliente({ cliente, vehiculo }) {
    const [kilometraje, setKilometraje] = useState('')
    const [productos, setProductos] = useState([])
    const [itemsSeleccionados, setItemsSeleccionados] = useState([])
    
    const [productoId, setProductoId] = useState('')
    const [cantidad, setCantidad] = useState(1)
    
    const [error, setError] = useState('')
    const [exito, setExito] = useState('')

    // 1. Cargar productos
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/productos/')
            .then(response => {
                setProductos(response.data)
            })
            .catch(err => {
                console.error(err)
                setError('Error cargando inventario.')
            })
    }, [])

    // 2. Función para Agregar Item
    const agregarItem = (e) => {
        e.preventDefault()
        if (!productoId) return

        const productoReal = productos.find(p => p.id === parseInt(productoId))
        if (!productoReal) return

        // --- CORRECCIÓN 1: Usamos 'precio_unitario' ---
        const precioNumerico = parseFloat(productoReal.precio_unitario) || 0 
        const cantidadNumerica = parseInt(cantidad) || 1

        const nuevoItem = {
            producto: productoReal,
            cantidad: cantidadNumerica,
            subtotal: precioNumerico * cantidadNumerica
        }

        setItemsSeleccionados([...itemsSeleccionados, nuevoItem])
        setExito('Item agregado')
        setTimeout(() => setExito(''), 2000)
    }

    const guardarOrden = async () => {
        // Validaciones
        if (!kilometraje) {
            setError('Por favor ingresa el Kilometraje actual.')
            return
        }
        if (itemsSeleccionados.length === 0) {
            setError('Agrega al menos un producto.')
            return
        }

        try {
            const datos = {
                vehiculo: vehiculo.id,
                cliente: cliente.id,
                kilometraje: kilometraje,
                estado: 'pendiente',
                total: itemsSeleccionados.reduce((sum, i) => sum + i.subtotal, 0),
                
                detalles: itemsSeleccionados.map(item => ({
                    producto: item.producto.id,
                    cantidad: item.cantidad,
                    // --- CORRECCIÓN 2: Usamos 'precio_unitario' ---
                    precio_al_momento: item.producto.precio_unitario || 0 
                }))
            }

            console.log("Enviando datos:", datos) 

            await axios.post('http://127.0.0.1:8000/api/proformas/', datos)
            
            alert('¡Orden Guardada con Éxito!')
            window.location.reload()
            
        } catch (err) {
            console.error(err)
            if (err.response && err.response.data) {
                setError(`Error del servidor: ${JSON.stringify(err.response.data)}`)
            } else {
                setError('Error al conectar con el servidor.')
            }
        }
    }

    const total = itemsSeleccionados.reduce((sum, item) => sum + item.subtotal, 0)

    return (
        <div>
            {/* CABECERA */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label text-muted">Cliente</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={cliente?.nombre || vehiculo?.cliente?.nombre || "..."} 
                        readOnly 
                        disabled 
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label text-muted">Vehículo</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={vehiculo ? `${vehiculo.marca} - ${vehiculo.placa}` : ''} 
                        readOnly 
                        disabled 
                    />
                </div>
            </div>

            {/* CAMPO KILOMETRAJE */}
            <div className="mb-4">
                <label className="form-label fw-bold">Kilometraje Actual *</label>
                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Ej: 150000"
                    value={kilometraje}
                    onChange={(e) => setKilometraje(e.target.value)}
                />
            </div>

            <hr />

            {/* SECCIÓN PRODUCTOS */}
            <div className="card p-3 bg-light border-0 shadow-sm">
                <h6 className="mb-3">🛒 Agregar Repuestos</h6>
                
                {error && <div className="alert alert-danger">{error}</div>}
                {exito && <div className="alert alert-success">{exito}</div>}

                <div className="d-flex gap-2 align-items-end flex-wrap">
                    <div className="flex-grow-1">
                        <label>Producto</label>
                        <select 
                            className="form-select" 
                            value={productoId} 
                            onChange={(e) => setProductoId(e.target.value)}
                        >
                            <option value="">-- Seleccionar --</option>
                            {productos.map(p => (
                                // --- CORRECCIÓN 3: Visualización en el menú ---
                                <option key={p.id} value={p.id}>
                                    {p.nombre} - ${ (parseFloat(p.precio_unitario) || 0).toFixed(2) }
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{width: '100px'}}>
                        <label>Cant.</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={cantidad} 
                            onChange={(e) => setCantidad(e.target.value)}
                            min="1"
                        />
                    </div>
                    <button onClick={agregarItem} className="btn btn-success">+ Agregar</button>
                </div>
            </div>

            {/* TABLA */}
            <table className="table mt-3 align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Descripción</th>
                        <th>Cant.</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {itemsSeleccionados.map((item, i) => (
                        <tr key={i}>
                            <td>{item.producto.nombre}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.subtotal.toFixed(2)}</td>
                            <td className="text-end">
                                <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                        const n = [...itemsSeleccionados]; n.splice(i,1); setItemsSeleccionados(n)
                                    }}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2" className="text-end fw-bold">TOTAL:</td>
                        <td className="fw-bold fs-5">${total.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <button onClick={guardarOrden} className="btn btn-primary w-100 mt-3 py-2 fw-bold">
                💾 Guardar Orden de Trabajo
            </button>
        </div>
    )
}

export default FormularioCliente