import { useState } from 'react';
import { login } from './firebase';
import SignUp from './SignUp';

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

    const [signUpOpened, setSignUpOpened] = useState(false);

    return (
        <div>{
          !signUpOpened ? (
            <div> 
              <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Connexion</button>
              </form>
              <button onClick={() => setSignUpOpened(true)}>Créer un compte</button>
            </div>
          )
          :
          (
            <div>
              <SignUp />
              <button onClick={() => setSignUpOpened(false)}>Retour</button>
            </div>
          )
        }
        </div>
    )
}

  export default Login;