import { useState } from 'react'
import axios from 'axios'

function Login({ setToken }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('') // Limpiar errores previos

        try {
            // Enviamos usuario y contraseña a Django
            const response = await axios.post('http://127.0.0.1:8000/api-token-auth/', {
                username: username,
                password: password
            })

            // Si es correcto, Django nos devuelve un token
            const tokenRecibido = response.data.token
            
            // Guardamos el token en la "memoria del navegador" (LocalStorage)
            localStorage.setItem('token', tokenRecibido)
            
            // Avisamos a App.jsx que ya entramos
            setToken(tokenRecibido)

        } catch (err) {
            console.error(err)
            setError('Usuario o contraseña incorrectos')
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>🔐 Iniciar Sesión</h2>
                
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                    Entrar
                </button>
            </form>
        </div>
    )
}

export default Login