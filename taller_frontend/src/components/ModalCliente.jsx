import React, { useState } from 'react';
import axios from 'axios';

function ModalCliente({ cerrarModal, alGuardar }) {
    // 1. AQUI AGREGUÉ LA CÉDULA AL ESTADO
    const [form, setForm] = useState({
        cedula: '', 
        nombre: '',
        telefono: '',
        email: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 2. VALIDACIÓN: AHORA REVISAMOS QUE EXISTA LA CÉDULA
        if (!form.cedula || !form.nombre || !form.telefono) {
            setError('La cédula, el nombre y teléfono son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/clientes/', form);
            alGuardar(response.data);
            cerrarModal(); 
        } catch (err) {
            console.error(err);
            // Mejor manejo de errores para saber qué pasó
            if (err.response && err.response.data) {
                // Esto convierte el error {"cedula": ["ya existe"]} en un texto legible
                const mensaje = Object.entries(err.response.data)
                    .map(([key, msg]) => `${key}: ${msg}`)
                    .join(', ');
                setError(mensaje);
            } else {
                setError('Error al guardar. Verifica los datos.');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box" style={{ maxWidth: '500px', textAlign: 'left' }}>
                <h4 className="mb-4">👤 Nuevo Cliente</h4>
                
                {error && <div className="alert alert-danger p-2 text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    
                    {/* 3. AQUÍ AGREGUÉ EL CAMPO DE CÉDULA VISUALMENTE */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Cédula / RUC</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="cedula"
                            value={form.cedula}
                            onChange={handleChange}
                            placeholder="Ej: 1310000000"
                            autoFocus
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre Completo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email (Opcional)</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCliente;