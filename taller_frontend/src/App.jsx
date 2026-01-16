import { useState } from 'react'
import axios from 'axios'
import Buscador from './components/Buscador'
import FormularioCliente from './components/FormularioCliente'
import ListaProformas from './components/ListaProformas' // <--- 1. Importar

function App() {
  // Estado para controlar la pestaña activa ('nueva' o 'historial')
  const [vistaActual, setVistaActual] = useState('nueva') // <--- 2. Nuevo Estado

  // ... (Tus estados anteriores: itemsProforma, datosEncabezado... DÉJALOS IGUAL)
  const [itemsProforma, setItemsProforma] = useState([])
  const [datosEncabezado, setDatosEncabezado] = useState({ placa: '', vehiculo: {}, cliente: {} })
  const TASA_IVA = 0.15 

  // ... (Tus funciones manejarCambioCliente, agregarProducto, actualizarCantidad, eliminarItem... DÉJALAS IGUAL) ...
  const manejarCambioCliente = (placa, vehiculo, cliente) => { /*...*/ setDatosEncabezado({ placa, vehiculo: vehiculo || {}, cliente: cliente || {} }) }
  const agregarProducto = (producto) => { /*...*/ 
      const existe = itemsProforma.find(item => item.id === producto.id)
      if (existe) { actualizarCantidad(producto.id, existe.cantidad + 1) } 
      else { setItemsProforma([...itemsProforma, { ...producto, cantidad: 1, precio_unitario: parseFloat(producto.precio_unitario), total_fila: parseFloat(producto.precio_unitario) }]) }
  }
  const actualizarCantidad = (id, nuevaCantidad) => { /*...*/ 
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return 
      setItemsProforma(itemsProforma.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad, total_fila: item.precio_unitario * nuevaCantidad } : item))
  }
  const eliminarItem = (id) => { setItemsProforma(itemsProforma.filter(item => item.id !== id)) }

  // ... (Tu función guardarProforma DÉJALA IGUAL, solo agrega una cosita al final) ...
  const guardarProforma = async () => {
     // ... validaciones ...
     try {
        const payload = {
            cliente: datosEncabezado.cliente.id,
            vehiculo: datosEncabezado.vehiculo.id,
            kilometraje: parseInt(datosEncabezado.vehiculo.kilometraje) || 0,
            detalles: itemsProforma.map(item => ({
                producto: item.id,
                cantidad: item.cantidad,
                precio_al_momento: item.precio_unitario,
                subtotal: item.total_fila
            }))
        }
        await axios.post('http://127.0.0.1:8000/api/proformas/', payload)
        alert("✅ ¡Orden Guardada con Éxito!")
        setItemsProforma([])
        setDatosEncabezado({ placa: '', vehiculo: {}, cliente: {} })
        
        // --- CAMBIO AQUÍ: ---
        // Al guardar, nos vamos automáticamente al historial para verla
        setVistaActual('historial') 
        // --------------------

     } catch (error) {
        console.error(error)
        alert("❌ Error al guardar.")
     }
  }

  // Cálculos
  const subtotal = itemsProforma.reduce((acc, item) => acc + item.total_fila, 0)
  const valorIVA = subtotal * TASA_IVA
  const totalPagar = subtotal + valorIVA

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🔧 Sistema Taller</h1>

      {/* 3. MENÚ DE NAVEGACIÓN (TABS) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
          <button 
            onClick={() => setVistaActual('nueva')}
            style={{ 
                padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: '5px', fontSize: '1.1em',
                background: vistaActual === 'nueva' ? '#007bff' : '#e9ecef',
                color: vistaActual === 'nueva' ? 'white' : 'black'
            }}
          >
            📝 Nueva Orden
          </button>
          <button 
            onClick={() => setVistaActual('historial')}
            style={{ 
                padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: '5px', fontSize: '1.1em',
                background: vistaActual === 'historial' ? '#007bff' : '#e9ecef',
                color: vistaActual === 'historial' ? 'white' : 'black'
            }}
          >
            📂 Historial
          </button>
      </div>

      {/* 4. RENDERIZADO CONDICIONAL: Mostramos una pantalla u otra */}
      
      {vistaActual === 'historial' ? (
          // SI ESTAMOS EN HISTORIAL:
          <ListaProformas />
      ) : (
          // SI ESTAMOS EN NUEVA ORDEN (Todo tu código anterior):
          <>
            <FormularioCliente alCambiarDatos={manejarCambioCliente} />
            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ccc' }} />
            <Buscador alSeleccionar={agregarProducto} />
            
            <h3 style={{ marginTop: '20px' }}>Detalle de Repuestos y Servicios:</h3>
            {/* ... Aquí sigue tu tabla de productos y totales exactamente igual que antes ... */}
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
                        <th style={{ padding: '10px' }}>P. Unit</th>
                        <th style={{ padding: '10px' }}>Total</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>X</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itemsProforma.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>
                            <input type="number" value={item.cantidad} onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))} style={{ width: '60px', textAlign: 'center' }} />
                        </td>
                        <td style={{ padding: '10px' }}><strong>{item.nombre}</strong></td>
                        <td style={{ padding: '10px' }}>${item.precio_unitario.toFixed(2)}</td>
                        <td style={{ padding: '10px' }}>${item.total_fila.toFixed(2)}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}><button onClick={() => eliminarItem(item.id)} style={{color:'red'}}>X</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <div style={{ width: '300px', background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                         {/* Totales */}
                        <div>Subtotal: <strong>${subtotal.toFixed(2)}</strong></div>
                        <div>IVA (15%): <strong>${valorIVA.toFixed(2)}</strong></div>
                        <div style={{fontSize: '1.4em', marginTop:'10px'}}>Total: <strong>${totalPagar.toFixed(2)}</strong></div>
                        <button onClick={guardarProforma} style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>💾 Guardar Orden</button>
                    </div>
                </div>
                </>
            )}
          </>
      )}
    </div>
  )
}

export default App