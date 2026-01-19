import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModalVehiculo({ cerrarModal, alGuardar }) {
    // Estado del formulario
    const [form, setForm] = useState({
        placa: '',
        marca: '',
        modelo: '',
        anio: '',
        cliente: '' // Aquí guardaremos el ID del cliente (ej: 5)
    });

    // Estado para la lista desplegable de clientes
    const [listaClientes, setListaClientes] = useState([]);
    const [error, setError] = useState('');

    // 1. CARGAR CLIENTES AL ABRIR EL MODAL
    useEffect(() => {
        const cargarClientes = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/clientes/');
                setListaClientes(res.data);
            } catch (err) {
                console.error("Error cargando clientes:", err);
                setError("No se pudo cargar la lista de clientes.");
            }
        };
        cargarClientes();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación
        if (!form.placa || !form.marca || !form.cliente) {
            setError('La placa, la marca y el cliente son obligatorios.');
            return;
        }

        try {
            // Convertimos los datos antes de enviar
            const datosAEnviar = {
                ...form,
                cliente: parseInt(form.cliente) // Aseguramos que sea un número entero
            };

            const response = await axios.post('http://127.0.0.1:8000/api/vehiculos/', datosAEnviar);
            
            // TRUCO: Django devuelve el auto creado, pero el cliente viene solo como ID (ej: cliente: 1).
            // Para que la tabla se vea bonita sin recargar, buscamos el nombre del cliente y lo pegamos.
            const clienteSeleccionado = listaClientes.find(c => c.id == form.cliente);
            
            const autoCompleto = {
                ...response.data,
                cliente: clienteSeleccionado // Reemplazamos el ID con el objeto completo (nombre, etc)
            };

            alGuardar(autoCompleto);
            cerrarModal();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Mismo truco de antes para mostrar errores de Django
                const mensaje = Object.entries(err.response.data)
                    .map(([key, msg]) => `${key}: ${msg}`)
                    .join(', ');
                setError(mensaje);
            } else {
                setError('Error al guardar el vehículo.');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box" style={{ maxWidth: '600px', textAlign: 'left' }}>
                <h4 className="mb-4">🚗 Nuevo Vehículo</h4>
                
                {error && <div className="alert alert-danger p-2 text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    
                    {/* SELECCIONAR CLIENTE */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Dueño del Vehículo</label>
                        <select 
                            className="form-select" 
                            name="cliente" 
                            value={form.cliente}
                            onChange={handleChange}
                            autoFocus
                        >
                            <option value="">-- Selecciona un Cliente --</option>
                            {listaClientes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre} - {c.cedula || 'S/C'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="form-label">Placa</label>
                            <input 
                                type="text" className="form-control" placeholder="Ej: ABC-1234"
                                name="placa" value={form.placa} onChange={handleChange}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <label className="form-label">Año</label>
                            <input 
                                type="number" className="form-control" placeholder="Ej: 2020"
                                name="anio" value={form.anio} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="form-label">Marca</label>
                            <input 
                                type="text" className="form-control" placeholder="Ej: Toyota"
                                name="marca" value={form.marca} onChange={handleChange}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <label className="form-label">Modelo</label>
                            <input 
                                type="text" className="form-control" placeholder="Ej: Yaris"
                                name="modelo" value={form.modelo} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-success">
                            Guardar Vehículo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalVehiculo;   