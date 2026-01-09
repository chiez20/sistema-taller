import { useState } from 'react'
import axios from 'axios'

function FormularioCliente({ alCambiarDatos }) {
    // Estados locales para los campos
    const [placa, setPlaca] = useState('')
    const [vehiculo, setVehiculo] = useState({ marca: '', modelo: '', kilometraje: '' })
    const [cliente, setCliente] = useState({ cedula: '', nombre: '', telefono: '', direccion: '' })
    const [mensaje, setMensaje] = useState('')

    // Función para buscar cuando el usuario sale del campo PLACA (onBlur)
    const buscarPlaca = async () => {
        if (!placa) return

        setMensaje('Buscando...')
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/vehiculos/?search=${placa}`)
            
            if (response.data.length > 0) {
                // ¡Encontramos el auto!
                const autoEncontrado = response.data[0] // Tomamos el primero
                
                // Llenamos datos del vehiculo
                const datosAuto = {
                    marca: autoEncontrado.marca,
                    modelo: autoEncontrado.modelo,
                    kilometraje: '' // El kilometraje siempre cambia, se deja vacío
                }
                setVehiculo(datosAuto)

                // Ahora buscamos los datos del CLIENTE dueño de ese auto
                // Como el auto trae el ID del cliente, hacemos otra petición pequeña
                const idCliente = autoEncontrado.cliente
                const respCliente = await axios.get(`http://127.0.0.1:8000/api/clientes/${idCliente}/`)
                
                setCliente(respCliente.data)
                setMensaje('✅ Datos cargados automáticamente')
                
                // Avisamos a App.jsx que tenemos datos
                alCambiarDatos(placa, datosAuto, respCliente.data)
            } else {
                setMensaje('ℹ️ Vehículo nuevo. Ingrese los datos manualmente.')
                // Limpiamos para que escriba
                setVehiculo({ marca: '', modelo: '', kilometraje: '' })
                setCliente({ cedula: '', nombre: '', telefono: '', direccion: '' })
                alCambiarDatos(placa, null, null) // Avisamos que es nuevo
            }
        } catch (error) {
            console.error(error)
            setMensaje('❌ Error conectando con el sistema')
        }
    }

    // Manejador genérico para inputs (para poder escribir)
    const handleChange = (setFn, estadoActual, campo, valor) => {
        const nuevosDatos = { ...estadoActual, [campo]: valor }
        setFn(nuevosDatos)
        // Enviamos los cambios hacia arriba (App.jsx) en tiempo real
        alCambiarDatos(placa, campo === 'marca' || campo === 'modelo' || campo === 'kilometraje' ? nuevosDatos : vehiculo, campo === 'marca' ? cliente : nuevosDatos)
    }

    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
            <h3>👤 Datos del Cliente y Vehículo</h3>
            
            {/* Fila 1: Placa (El buscador) */}
            <div style={{ marginBottom: '15px' }}>
                <label><strong>Placa:</strong></label>
                <input 
                    type="text" 
                    value={placa} 
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    onBlur={buscarPlaca} // <--- Al salir de la casilla, busca
                    placeholder="Ingrese Placa y presione TAB"
                    style={{ marginLeft: '10px', padding: '5px', fontWeight: 'bold', width: '150px' }}
                />
                <span style={{ marginLeft: '15px', color: '#666', fontSize: '0.9em' }}>{mensaje}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Columna Izquierda: Vehículo */}
                <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>🚗 Vehículo</h4>
                    <input style={inputStyle} placeholder="Marca" value={vehiculo.marca} onChange={e => handleChange(setVehiculo, vehiculo, 'marca', e.target.value)} />
                    <input style={inputStyle} placeholder="Modelo" value={vehiculo.modelo} onChange={e => handleChange(setVehiculo, vehiculo, 'modelo', e.target.value)} />
                    <input style={inputStyle} type="number" placeholder="Kilometraje Actual" value={vehiculo.kilometraje} onChange={e => handleChange(setVehiculo, vehiculo, 'kilometraje', e.target.value)} />
                </div>

                {/* Columna Derecha: Cliente */}
                <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>👤 Cliente</h4>
                    <input style={inputStyle} placeholder="Cédula / RUC" value={cliente.cedula} onChange={e => setCliente({...cliente, cedula: e.target.value})} />
                    <input style={inputStyle} placeholder="Nombre Completo" value={cliente.nombre} onChange={e => setCliente({...cliente, nombre: e.target.value})} />
                    <input style={inputStyle} placeholder="Teléfono" value={cliente.telefono} onChange={e => setCliente({...cliente, telefono: e.target.value})} />
                </div>
            </div>
        </div>
    )
}

const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
}

export default FormularioCliente