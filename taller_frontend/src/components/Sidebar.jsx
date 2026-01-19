import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onLogout, setView, currentView, children }) {
    // Estado para el modal de salir
    const [showModal, setShowModal] = useState(false);
    // Estado para el menú hamburguesa (True = Abierto por defecto)
    const [isOpen, setIsOpen] = useState(true);

    const handleConfirmLogout = () => {
        setShowModal(false);
        onLogout();
    };

    return (
        <div className="dashboard-container">
            
            {/* --- BOTÓN HAMBURGUESA (Las 3 rayas) --- */}
            {/* Este botón vive fuera del sidebar para poder clickearlo cuando el sidebar desaparece */}
            <button 
                className={`btn-hamburger ${isOpen ? 'white-icon' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Ocultar menú" : "Mostrar menú"}
            >
                {/* SVG de 3 rayas */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>

            {/* --- MENÚ LATERAL --- */}
            {/* Agregamos la clase 'closed' si isOpen es falso */}
            <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
                <div className="sidebar-header">
                    {/* Movemos el título un poco a la izquierda para que no choque con la X */}
                    <h3 style={{textAlign: 'left'}}>🛠️ TALLER</h3>
                </div>

                <nav className="sidebar-menu">
                    <div className={`menu-item ${currentView === 'inicio' ? 'active' : ''}`} onClick={() => setView('inicio')}>
                        🏠 Inicio
                    </div>
                    <div className={`menu-item ${currentView === 'clientes' ? 'active' : ''}`} onClick={() => setView('clientes')}>
                        👥 Clientes
                    </div>
                    <div className={`menu-item ${currentView === 'vehiculos' ? 'active' : ''}`} onClick={() => setView('vehiculos')}>
                        🚗 Vehículos
                    </div>
                    <div className={`menu-item ${currentView === 'taller' ? 'active' : ''}`} onClick={() => setView('taller')}>
                        🔧 Orden Taller
                    </div>
                    <div className={`menu-item ${currentView === 'productos' ? 'active' : ''}`} onClick={() => setView('productos')}>
                        📦 Inventario
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button 
                        onClick={() => setShowModal(true)} 
                        className="btn-logout-icon" 
                        title="Cerrar Sesión"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7.5 1v7h1V1z"/>
                            <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
                        </svg>
                    </button>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="main-content">
                {children}
            </main>

            {/* --- MODAL DE SALIDA --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h4>¿Cerrar Sesión?</h4>
                        <p>¿Estás seguro que deseas salir del sistema?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-confirm" onClick={handleConfirmLogout}>
                                ¡Sí, salir!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;