import { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

// Importamos los componentes
import Buscador from "./components/Buscador"
import FormularioCliente from "./components/FormularioCliente"
import ListaProformas from "./components/ListaProformas"
import Login from "./components/Login"
import Sidebar from "./components/Sidebar" // <--- NUEVO COMPONENTE
import ListaClientes from "./components/ListaClientes"
import ListaVehiculos from "./components/ListaVehiculos"

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [vista, setVista] = useState('taller') // 'inicio', 'clientes', 'taller', etc.

  // --- CONFIGURACIÓN DE SEGURIDAD ---
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setClienteSeleccionado(null)
    setVehiculoSeleccionado(null)
  }

  // 1. Si no hay token, mostramos el Login (que ahora está centrado y bonito)
  if (!token) {
    return <Login setToken={setToken} />
  }

  // 2. Si hay token, mostramos el Dashboard con Sidebar
  return (
    <Sidebar 
        onLogout={logout} 
        setView={setVista} 
        currentView={vista}
    >
      {/* --- AQUÍ COMIENZA EL CONTENIDO DINÁMICO (Lado Derecho) --- */}
      
      {vista === 'taller' && (
        <div className="container-fluid"> {/* Usamos container-fluid para aprovechar el espacio */}
          <h2 className="mb-4 text-dark">🛠️ Orden de Taller</h2>
          
          <div className="row">
            {/* COLUMNA IZQUIERDA: BUSCADOR */}
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white fw-bold">
                  1. Buscar Vehículo
                </div>
                <div className="card-body">
                  <Buscador 
                    onClienteEncontrado={setClienteSeleccionado} 
                    onVehiculoEncontrado={setVehiculoSeleccionado}
                  />
                  
                  {vehiculoSeleccionado && (
                     <div className="alert alert-success mt-3 shadow-sm">
                       <strong>Auto seleccionado:</strong><br/>
                       {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}<br/>
                       <small>{vehiculoSeleccionado.placa}</small>
                     </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO */}
            <div className="col-md-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-success text-white fw-bold">
                  2. Detalles de la Orden
                </div>
                <div className="card-body">
                  {vehiculoSeleccionado ? (
                     <FormularioCliente 
                       cliente={clienteSeleccionado}
                       vehiculo={vehiculoSeleccionado}
                     />
                  ) : (
                     <div className="text-center p-5 text-muted">
                        <div style={{fontSize: '3rem'}}>⬅️🚗</div>
                        <h3>Selecciona un vehículo</h3>
                        <p>Utiliza el buscador de la izquierda para comenzar una nueva orden.</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA: HISTORIAL */}
      {vista === 'inicio' && (
          // Como placeholder, mostramos el historial en 'inicio' también por ahora
          <ListaProformas /> 
      )}
      
      {/* VISTA: CLIENTES (NUEVO) */}
      {vista === 'clientes' && (
          <ListaClientes />
      )}

      {/* VISTA: VEHICULOS (NUEVO) */}
      {vista === 'vehiculos' && (
          <ListaVehiculos />
      )}

      {/* VISTA: HISTORIAL */}
      {vista === 'historial' && (
        <ListaProformas />
      )}
      
      {/* Puedes agregar más condiciones para las otras vistas del menú aquí */}

    </Sidebar>
  )
}

export default App