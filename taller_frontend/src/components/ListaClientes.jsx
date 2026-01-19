import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalCliente from './ModalCliente'; // <--- IMPORTANTE

function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false); // <--- ESTADO NUEVO

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/clientes/');
                setClientes(response.data);
                setCargando(false);
            } catch (error) {
                console.error("Error cargando clientes:", error);
                setCargando(false);
            }
        };
        obtenerClientes();
    }, []);

    // Función que se ejecuta cuando el Modal guarda exitosamente
    const handleClienteGuardado = (nuevoCliente) => {
        setClientes([...clientes, nuevoCliente]); // Lo agrega a la lista visualmente
    };

    const clientesFiltrados = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.telefono.includes(busqueda) ||
        (cliente.email && cliente.email.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <div className="container-fluid">
            <h2 className="mb-4 text-dark">👥 Gestión de Clientes</h2>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 font-weight-bold text-primary">Listado de Clientes</h5>
                    {/* BOTÓN ACTIVADO */}
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => setMostrarModal(true)}
                    >
                        + Nuevo Cliente
                    </button>
                </div>
                
                <div className="card-body">
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="🔍 Buscar por nombre, teléfono o email..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {cargando ? (
                        <div className="text-center p-4">Cargando datos...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Teléfono</th>
                                        <th>Email</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientesFiltrados.length > 0 ? (
                                        clientesFiltrados.map((cliente) => (
                                            <tr key={cliente.id}>
                                                <td className="fw-bold">{cliente.nombre}</td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        📞 {cliente.telefono}
                                                    </span>
                                                </td>
                                                <td>{cliente.email || <span className="text-muted text-sm">No registrado</span>}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">
                                                No se encontraron clientes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {mostrarModal && (
                <ModalCliente 
                    cerrarModal={() => setMostrarModal(false)}
                    alGuardar={handleClienteGuardado}
                />
            )}
        </div>
    );
}

export default ListaClientes;