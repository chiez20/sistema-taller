import { useEffect, useState } from 'react'
import axios from 'axios'

function ListaProformas() {
    const [proformas, setProformas] = useState([])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/proformas/')
            .then(response => {
                setProformas(response.data)
            })
            .catch(error => console.error("Error:", error))
    }, [])

    const descargarPDF = (id) => {
        axios.get(`http://127.0.0.1:8000/api/proformas/${id}/pdf/`, { 
            responseType: 'blob' 
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orden_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        })
        .catch(err => alert("Error al descargar PDF. Verifica que hayas iniciado sesión."))
    }

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
                <h4 className="m-0">📂 Historial</h4>
            </div>
            <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehículo</th>
                            <th>Total</th>
                            <th style={{width: '120px'}}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proformas.map((prof) => (
                            <tr key={prof.id}>
                                <td>#{prof.id}</td>
                                <td>
                                    {/* VALIDACIÓN DE SEGURIDAD: Si no hay vehículo, mostramos texto genérico */}
                                    {prof.vehiculo ? (
                                        <>
                                            <strong>{prof.vehiculo.marca}</strong> <br/>
                                            <span className="text-muted">{prof.vehiculo.placa}</span>
                                        </>
                                    ) : (
                                        <span className="text-danger">Vehículo eliminado</span>
                                    )}
                                </td>
                                <td>
                                    {/* Si el total viene nulo, mostramos 0.00 */}
                                    ${prof.total ? parseFloat(prof.total).toFixed(2) : "0.00"}
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm w-100"
                                        onClick={() => descargarPDF(prof.id)}
                                    >
                                        📄 PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {proformas.length === 0 && (
                    <div className="text-center p-4">No hay datos para mostrar.</div>
                )}
            </div>
        </div>
    )
}

export default ListaProformas