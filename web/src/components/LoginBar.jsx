import React, { useState } from 'react';
import { api } from '../api/client';

export default function LoginBar() {
    const [email, setEmail] = useState('admin@wits.local');
    const [password, setPassword] = useState('admin123');
    const [status, setStatus] = useState(localStorage.getItem('wits_token') ? 'connecté' : 'anonyme');

    const login = async (e) => {
        e.preventDefault();
        try {
            const { token } = await api.auth.login(email, password);
            localStorage.setItem('wits_token', token);
            setStatus('connecté');
            alert('Connecté.');
        } catch (e2) {
            alert('Login refusé: ' + e2.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('wits_token');
        setStatus('anonyme');
        alert('Déconnecté.');
    };

    return (
        <form className="row" onSubmit={login} style={{marginBottom:12}}>
            <span className="badge">Auth: {status}</span>
            <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button type="submit">Login</button>
            <button type="button" onClick={logout}>Logout</button>
        </form>
    );


    // … imports existants …
    export default function LoginBar() {
        // … state & login existants …
        const logout = () => {
            localStorage.removeItem('wits_token');
            window.location.reload();
        };

        return (
            <div className="loginbar">
                {/* … inputs email / password + bouton Login … */}
                <button onClick={logout}>Logout</button>
            </div>
        );
    }


}
