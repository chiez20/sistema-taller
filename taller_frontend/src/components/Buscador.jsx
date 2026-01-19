import { useState } from 'react'
import axios from 'axios'

function Buscador({ onClienteEncontrado, onVehiculoEncontrado }) {
    const [termino, setTermino] = useState('')
    const [resultados, setResultados] = useState([])
    const [error, setError] = useState('')

    const buscar = async (e) => {
        e.preventDefault()
        setError('')
        setResultados([]) // Limpiar anteriores

        try {
            // Buscamos en la API
            const response = await axios.get(`http://127.0.0.1:8000/api/vehiculos/?search=${termino}`)
            setResultados(response.data)
            
            if (response.data.length === 0) {
                setError('No se encontraron vehículos con esa placa o marca.')
            }
        } catch (err) {
            console.error(err)
            setError('Error al conectar con el servidor.')
        }
    }

    const seleccionar = (vehiculo) => {
        // 1. Enviamos el vehículo encontrado (esto está bien)
        onVehiculoEncontrado(vehiculo)
        
        // 2. CORRECCIÓN AQUÍ 👇
        // Antes enviabas 'vehiculo.cliente' (que es el ID número).
        // Ahora enviamos 'vehiculo.cliente_nombre' (que es el Texto del nombre).
        if (vehiculo.cliente_nombre) {
            onClienteEncontrado(vehiculo.cliente_nombre)
        }
        
        // Limpiamos la búsqueda
        setResultados([])
        setTermino('')
    }

    return (
        <div>
            <form onSubmit={buscar} className="d-flex gap-2 mb-3">
                <input 
                    type="text" 
                    className="form-control"
                    placeholder="Ingrese placa, marca o modelo..." 
                    value={termino}
                    onChange={(e) => setTermino(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">🔍 Buscar</button>
            </form>

            {error && <div className="alert alert-warning">{error}</div>}

            {resultados.length > 0 && (
                <div className="list-group">
                    {resultados.map((vehiculo) => (
                        <button 
                            key={vehiculo.id}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            onClick={() => seleccionar(vehiculo)}
                        >
                            <div>
                                <strong>{vehiculo.marca} {vehiculo.modelo}</strong>
                                <br/>
                                <small className="text-muted">Placa: {vehiculo.placa}</small>
                            </div>
                            <span className="badge bg-success rounded-pill">Seleccionar 👉</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Buscador