import { useState, useEffect } from 'react'
import Buscador from './components/Buscador'

function App() {
  const [itemsProforma, setItemsProforma] = useState([])
  
  // Constantes de impuestos (Ecuador actualmente 15%)
  const TASA_IVA = 0.15 

  // 1. Agregar producto (Evita duplicados: si ya existe, suma 1 a la cantidad)
  const agregarProducto = (producto) => {
    const existe = itemsProforma.find(item => item.id === producto.id)
    
    if (existe) {
      // Si ya está en la lista, aumentamos la cantidad
      actualizarCantidad(producto.id, existe.cantidad + 1)
    } else {
      // Si es nuevo, lo agregamos con cantidad 1
      const nuevoItem = {
        ...producto,
        cantidad: 1,
        precio_unitario: parseFloat(producto.precio_unitario),
        total_fila: parseFloat(producto.precio_unitario)
      }
      setItemsProforma([...itemsProforma, nuevoItem])
    }
  }

  // 2. Cambiar cantidad y recalcular precio de la fila
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return // No permitir negativos

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

  // 3. Eliminar una fila
  const eliminarItem = (id) => {
    const nuevaLista = itemsProforma.filter(item => item.id !== id)
    setItemsProforma(nuevaLista)
  }

  // 4. Cálculos finales (Matemáticas automáticas)
  const subtotal = itemsProforma.reduce((acc, item) => acc + item.total_fila, 0)
  const valorIVA = subtotal * TASA_IVA
  const totalPagar = subtotal + valorIVA

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🛠️ Nueva Proforma / Orden</h1>
      
      {/* Buscador Importado */}
      <Buscador alSeleccionar={agregarProducto} />

      <hr />

      {/* Tabla Interactiva */}
      <h3>Detalle de Items:</h3>
      
      {itemsProforma.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>-- La proforma está vacía --</p>
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
                <th style={{ padding: '10px' }}>Acción</th>
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
                      style={{ width: '50px', padding: '5px' }}
                    />
                  </td>
                  <td style={{ padding: '10px' }}>
                    {item.nombre} <br/>
                    <small style={{color: '#666'}}>{item.codigo}</small>
                  </td>
                  <td style={{ padding: '10px' }}><small>{item.tipo}</small></td>
                  <td style={{ padding: '10px' }}>${item.precio_unitario.toFixed(2)}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>${item.total_fila.toFixed(2)}</td>
                  <td style={{ padding: '10px' }}>
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

          {/* Zona de Totales */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <div style={{ width: '250px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Subtotal:</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>IVA (15%):</span>
                <strong>${valorIVA.toFixed(2)}</strong>
              </div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', color: '#007bff' }}>
                <strong>TOTAL:</strong>
                <strong>${totalPagar.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App