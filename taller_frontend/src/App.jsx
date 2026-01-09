import { useState } from 'react'
import Buscador from './components/Buscador'
import FormularioCliente from './components/FormularioCliente'

function App() {
  // --- ESTADOS (La memoria de la pantalla) ---

  // 1. Lista de productos agregados a la tabla
  const [itemsProforma, setItemsProforma] = useState([])
  
  // 2. Datos del encabezado (Cliente y Vehículo)
  const [datosEncabezado, setDatosEncabezado] = useState({
      placa: '',
      vehiculo: {},
      cliente: {}
  })

  // Constante de impuestos (Ecuador 15%)
  const TASA_IVA = 0.15 

  // --- FUNCIONES (La lógica) ---

  // Recibe los datos desde el componente hijo FormularioCliente
  const manejarCambioCliente = (placa, vehiculo, cliente) => {
      setDatosEncabezado({
          placa: placa,
          vehiculo: vehiculo || {},
          cliente: cliente || {}
      })
  }

  // Agregar producto desde el Buscador
  const agregarProducto = (producto) => {
    const existe = itemsProforma.find(item => item.id === producto.id)
    
    if (existe) {
      // Si ya existe, sumamos 1 a la cantidad
      actualizarCantidad(producto.id, existe.cantidad + 1)
    } else {
      // Si es nuevo, lo agregamos
      const nuevoItem = {
        ...producto,
        cantidad: 1,
        precio_unitario: parseFloat(producto.precio_unitario),
        total_fila: parseFloat(producto.precio_unitario)
      }
      setItemsProforma([...itemsProforma, nuevoItem])
    }
  }

  // Modificar la cantidad manual y recalcular fila
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return 

    const nuevaLista = itemsProforma.map(item => {
      if (item.id === id) {
        return {
          ...item,
          cantidad: nuevaCantidad,
          total_fila: item.precio_unitario * nuevaCantidad
        }
      }
      return item
    })
    setItemsProforma(nuevaLista)
  }

  // Eliminar fila
  const eliminarItem = (id) => {
    const nuevaLista = itemsProforma.filter(item => item.id !== id)
    setItemsProforma(nuevaLista)
  }

  // Función temporal para probar el botón de guardar
  const guardarProforma = () => {
    console.log("--- DATOS LISTOS PARA ENVIAR A DJANGO ---")
    console.log("Encabezado:", datosEncabezado)
    console.log("Detalles:", itemsProforma)
    alert("Revisa la consola (F12) para ver los datos que se enviarán.")
  }

  // --- CÁLCULOS MATEMÁTICOS ---
  const subtotal = itemsProforma.reduce((acc, item) => acc + item.total_fila, 0)
  const valorIVA = subtotal * TASA_IVA
  const totalPagar = subtotal + valorIVA

  // --- LA PANTALLA (HTML) ---
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🛠️ Nueva Orden de Trabajo</h1>
      
      {/* 1. SECCIÓN DE DATOS DEL CLIENTE */}
      <FormularioCliente alCambiarDatos={manejarCambioCliente} />
      
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ccc' }} />

      {/* 2. SECCIÓN DE BÚSQUEDA */}
      <Buscador alSeleccionar={agregarProducto} />

      {/* 3. TABLA DE DETALLES */}
      <h3 style={{ marginTop: '20px' }}>Detalle de Repuestos y Servicios:</h3>
      
      {itemsProforma.length === 0 ? (
        <div style={{ padding: '20px', background: '#f9f9f9', textAlign: 'center', color: '#888', borderRadius: '8px' }}>
          -- Agregue productos usando el buscador de arriba --
        </div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#007bff', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Cant.</th>
                <th style={{ padding: '10px' }}>Descripción</th>
                <th style={{ padding: '10px' }}>Tipo</th>
                <th style={{ padding: '10px' }}>P. Unit</th>
                <th style={{ padding: '10px' }}>Total</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {itemsProforma.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>
                    <input 
                      type="number" 
                      value={item.cantidad} 
                      onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))}
                      style={{ width: '60px', padding: '5px', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '10px' }}>
                    <strong>{item.nombre}</strong> <br/>
                    <small style={{color: '#666'}}>{item.codigo}</small>
                  </td>
                  <td style={{ padding: '10px' }}><small>{item.tipo}</small></td>
                  <td style={{ padding: '10px' }}>${item.precio_unitario.toFixed(2)}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>${item.total_fila.toFixed(2)}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button 
                      onClick={() => eliminarItem(item.id)}
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 4. ZONA DE TOTALES */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <div style={{ width: '300px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal:</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>IVA (15%):</span>
                <strong>${valorIVA.toFixed(2)}</strong>
              </div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4em', color: '#007bff', marginTop: '10px' }}>
                <strong>TOTAL:</strong>
                <strong>${totalPagar.toFixed(2)}</strong>
              </div>
              
              {/* Botón de Guardar */}
              <button 
                onClick={guardarProforma}
                style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1em', cursor: 'pointer' }}
              >
                💾 Guardar Orden
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App