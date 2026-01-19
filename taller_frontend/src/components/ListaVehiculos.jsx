import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalVehiculo from './ModalVehiculo'; // <--- 1. IMPORTAR

function ListaVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false); // <--- 2. ESTADO PARA MODAL

    useEffect(() => {
        const obtenerVehiculos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/vehiculos/');
                setVehiculos(response.data);
                setCargando(false);
            } catch (error) {
                console.error("Error cargando vehículos:", error);
                setCargando(false);
            }
        };
        obtenerVehiculos();
    }, []);

    // 3. FUNCIÓN PARA AGREGAR EL NUEVO AUTO A LA LISTA VISUAL
    const handleVehiculoGuardado = (nuevoAuto) => {
        setVehiculos([...vehiculos, nuevoAuto]);
    };

    const vehiculosFiltrados = vehiculos.filter(auto => {
        const textoBusqueda = busqueda.toLowerCase();
        const placa = auto.placa ? auto.placa.toLowerCase() : '';
        const marca = auto.marca ? auto.marca.toLowerCase() : '';
        const modelo = auto.modelo ? auto.modelo.toLowerCase() : '';
        const clienteNombre = auto.cliente_nombre ? auto.cliente_nombre.toLowerCase() : '';

        return placa.includes(textoBusqueda) || 
               marca.includes(textoBusqueda) || 
               modelo.includes(textoBusqueda) ||
               clienteNombre.includes(textoBusqueda);
    });

    return (
        <div className="container-fluid">
            <h2 className="mb-4 text-dark">🚗 Parque Automotor</h2>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 font-weight-bold text-success">Listado de Vehículos</h5>
                    
                    {/* 4. BOTÓN QUE ABRE EL MODAL */}
                    <button 
                        className="btn btn-success btn-sm"
                        onClick={() => setMostrarModal(true)}
                    >
                        + Nuevo Vehículo
                    </button>
                </div>
                
                <div className="card-body">
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="🔍 Buscar por placa, marca, modelo o dueño..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {cargando ? (
                        <div className="text-center p-4">Cargando flota...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Placa</th>
                                        <th>Vehículo</th>
                                        <th>Año</th>
                                        <th>Dueño</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehiculosFiltrados.length > 0 ? (
                                        vehiculosFiltrados.map((auto) => (
                                            <tr key={auto.id}>
                                                <td>
                                                    <span className="badge bg-warning text-dark border">
                                                        {auto.placa}
                                                    </span>
                                                </td>
                                                <td className="fw-bold">
                                                    {auto.marca} {auto.modelo}
                                                </td>
                                                <td>{auto.anio || '-'}</td>
                                                <td>
                                                    {/* Usamos ?. para evitar errores si no hay cliente */}
                                                    {auto.cliente_nombre || <span className="text-muted">Desconocido</span>}
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-success me-2">Ver Historial</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                No se encontraron vehículos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. RENDERIZAR EL MODAL SI ESTÁ ACTIVO */}
            {mostrarModal && (
                <ModalVehiculo 
                    cerrarModal={() => setMostrarModal(false)}
                    alGuardar={handleVehiculoGuardado}
                />
            )}
        </div>
    );
}

export default ListaVehiculos;