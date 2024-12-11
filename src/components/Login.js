import { useState } from 'react';
import { login } from './firebase';
import SignUp from './SignUp';
import backgroundImage from '../assets/LoginBackgroung.webp'; // Assurez-vous que le chemin est correct
import { UiButton, UiTextLight } from './UI/Ui';

function Login({ setConnected }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpOpened, setSignUpOpened] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setLoggingIn(true);
    try {
      const user = await login(email, password);
      setConnected(true);
      alert(`Bienvenue ${user.email}`);
    } catch (error) {
      setConnected(false);
      alert('Erreur lors de la connexion');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div
      className='flex items-center justify-center min-h-screen bg-cover bg-center'
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className='bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md'>
        {!signUpOpened ? (
          <div>
            <form className='w-full'>
              <div className='relative z-0 mb-6 w-full group'>
                <input
                  type='email'
                  name='floating_email'
                  id='floating_email'
                  className='block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                  placeholder=' '
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor='floating_email'
                  className='absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
                >
                  <UiTextLight text={"Email"} />
                </label>
              </div>

              <div className='relative z-0 mb-6 w-full group'>
                <input
                  type='password'
                  name='floating_password'
                  id='floating_password'
                  className='block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                  placeholder=' '
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor='floating_password'
                  className='absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
                >
                  <UiTextLight text={"Mot de passe"} />
                </label>
              </div>

              <div className='flex justify-end'>
                <UiButton text={loggingIn ? 'Connexion en cours...' : 'Connexion'} action={handleLogin}/>
              </div>
            </form>

            <div className='mt-4'>
              <button
                onClick={() => setSignUpOpened(true)}
                className='text-blue-700 hover:text-blue-800'
              >
                <UiTextLight text={"Créer un compte"} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <SignUp />
            <UiButton action={() => setSignUpOpened(false)} text={"Retour"} color={"grey"}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
