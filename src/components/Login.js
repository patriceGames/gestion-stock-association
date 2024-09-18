import { useState } from 'react';
import { login } from './firebase';

function Login({setConnected}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        if (email === '' || password === '') {
            alert("Veuillez remplir tous les champs");
            return;
        }
        e.preventDefault();
        try {
          const user = await login(email, password);
          alert(`Bienvenue ${user.email}`);
        } catch (error) {
          alert("Erreur lors de la connexion");
          return;
        }
        setConnected(true);
    };


    return (
        <div>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Connexion</button>
            </form>
        </div>
    )
}

  export default Login;