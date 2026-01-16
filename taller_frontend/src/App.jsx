import { useState, useEffect } from 'react'
import axios from 'axios' // Importante importar axios
import 'bootstrap/dist/css/bootstrap.min.css'
import Buscador from "./components/Buscador"
import FormularioCliente from "./components/FormularioCliente"
import ListaProformas from "./components/ListaProformas"
import Login from "./components/Login"

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [vista, setVista] = useState('taller')

  // --- CONFIGURACIÓN DE SEGURIDAD (TOKEN) ---
  // Esto asegura que CADA petición lleve el carnet de identidad
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    // Limpiamos datos al salir
    setClienteSeleccionado(null)
    setVehiculoSeleccionado(null)
  }

  // Si no hay token, mostramos Login
  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="container mt-4">
      {/* Barra Superior */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">
        <h2 className="m-0">🔧 Sistema Taller</h2>
        <div>
            <button className={`btn me-2 ${vista === 'taller' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setVista('taller')}>🛠️ Taller</button>
            <button className={`btn me-2 ${vista === 'historial' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setVista('historial')}>📂 Historial</button>
            <button className="btn btn-danger" onClick={logout}>🚪 Salir</button>
        </div>
      </div>

      {vista === 'taller' ? (
        <div className="row">
          {/* COLUMNA IZQUIERDA: BUSCADOR */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                1. Buscar Vehículo
              </div>
              <div className="card-body">
                <Buscador 
                  onClienteEncontrado={setClienteSeleccionado} 
                  onVehiculoEncontrado={setVehiculoSeleccionado}
                />
                
                {/* Mostramos la selección actual si existe */}
                {vehiculoSeleccionado && (
                   <div className="alert alert-success mt-3">
                      <strong>Auto seleccionado:</strong><br/>
                      {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}<br/>
                      <small>{vehiculoSeleccionado.placa}</small>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO DE TRABAJO */}
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                2. Orden de Trabajo (Repuestos y Servicios)
              </div>
              <div className="card-body">
                {/* AQUI ESTABA EL ERROR: Antes ocultábamos esto si no había vehículo.
                    Ahora lo mostramos siempre, pero avisamos si falta el auto. */}
                
                {vehiculoSeleccionado ? (
                    <FormularioCliente 
                      cliente={clienteSeleccionado}
                      vehiculo={vehiculoSeleccionado}
                    />
                ) : (
                    <div className="text-center p-5 text-muted">
                        <h3>⬅️ Selecciona un auto primero</h3>
                        <p>Usa el buscador de la izquierda para encontrar el vehículo y habilitar este panel.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // VISTA DE HISTORIAL
        <ListaProformas />
      )}
    </div>
  )
}

export default App