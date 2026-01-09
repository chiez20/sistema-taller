import { useState } from 'react'
import axios from 'axios'

function Buscador({ alSeleccionar }) {
    const [termino, setTermino] = useState('')
    const [resultados, setResultados] = useState([])

    // Función que se ejecuta cada vez que escribes
    const buscar = async (texto) => {
        setTermino(texto)
        
        // Si borras todo, limpia la lista
        if (texto.length === 0) {
            setResultados([])
            return
        }

        try {
            // Aquí llamamos a Django con el filtro ?search=
            const response = await axios.get(`http://127.0.0.1:8000/api/productos/?search=${texto}`)
            setResultados(response.data)
        } catch (error) {
            console.error("Error buscando:", error)
        }
    }

    return (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3>🔍 Agregar Repuesto o Servicio</h3>
            
            <input 
                type="text" 
                placeholder="Escribe código o nombre (ej: Freno)..." 
                value={termino}
                onChange={(e) => buscar(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />

            {/* Lista de resultados flotante */}
            {resultados.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', border: '1px solid #eee' }}>
                    {resultados.map(prod => (
                        <li key={prod.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                                <strong>{prod.nombre}</strong> <small>({prod.codigo})</small>
                            </span>
                            <div>
                                <span style={{ color: 'green', marginRight: '10px' }}>${prod.precio_unitario}</span>
                                <button 
                                    onClick={() => {
                                        alSeleccionar(prod)
                                        setTermino('')   // Limpiar input
                                        setResultados([]) // Limpiar lista
                                    }}
                                    style={{ cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                                >
                                    + Agregar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Buscador