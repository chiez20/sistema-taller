import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Importamos el diseño bonito

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // USAMOS LA URL CORRECTA DE TU CÓDIGO ORIGINAL
            const response = await axios.post('http://127.0.0.1:8000/api-token-auth/', {
                username: username,
                password: password
            });

            // Lógica original: Guardar en localStorage y actualizar estado
            const tokenRecibido = response.data.token;
            localStorage.setItem('token', tokenRecibido); // Para que no se salga al refrescar
            setToken(tokenRecibido); // Para avisar a React que entre
            
        } catch (err) {
            console.error(err);
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">🔐 Iniciar Sesión</h2>
                
                {/* Mensaje de error si falla */}
                {error && <div className="alert alert-danger" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <input 
                            type="text" 
                            className="form-control"
                            placeholder="Ej: admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;