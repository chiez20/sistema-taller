import { useEffect, useState } from 'react'
import axios from 'axios'

function ListaProformas() {
    const [proformas, setProformas] = useState([])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/proformas/')
            .then(response => {
                setProformas(response.data)
            })
            .catch(error => console.error("Error cargando historial:", error))
    }, [])

    // Función para abrir el PDF en una pestaña nueva
    const abrirPDF = (id) => {
        const url = `http://127.0.0.1:8000/api/proformas/${id}/pdf/`
        window.open(url, '_blank') // '_blank' abre nueva pestaña
    }

    return (
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#333' }}>📂 Historial de Órdenes</h2>
            
            {proformas.length === 0 ? (
                <p>No hay órdenes registradas aún.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>#</th>
                            <th style={{ padding: '10px' }}>Fecha</th>
                            <th style={{ padding: '10px' }}>Cliente</th>
                            <th style={{ padding: '10px' }}>Total</th>
                            <th style={{ padding: '10px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proformas.map((prof) => (
                            <tr key={prof.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>#{prof.id}</td>
                                <td style={{ padding: '10px' }}>
                                    {new Date(prof.fecha).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {prof.cliente?.nombre || '---'} <br/>
                                    <small style={{color:'#666'}}>{prof.vehiculo?.placa}</small>
                                </td>
                                <td style={{ padding: '10px', fontWeight: 'bold', color: '#28a745' }}>
                                    ${parseFloat(prof.total).toFixed(2)}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {/* BOTÓN DE IMPRIMIR */}
                                    <button 
                                        onClick={() => abrirPDF(prof.id)}
                                        style={{
                                            background: '#17a2b8', color: 'white', border: 'none',
                                            padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'
                                        }}
                                    >
                                        🖨️ PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ListaProformas