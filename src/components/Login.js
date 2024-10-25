import { useState } from 'react';
import { login } from './firebase';
import SignUp from './SignUp';

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
    <div className='w-full'>
      {!signUpOpened ? (
        <div>
          <form onSubmit={handleLogin} className='w-full'>
            <div className='relative z-0 mb-6 w-full group'>
              <input
                type='email'
                name='floating_email'
                id='floating_email'
                className='block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor='floating_email'
                className='absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
              >
                Email
              </label>
            </div>

            <div className='relative z-0 mb-6 w-full group'>
              <input
                type='password'
                name='floating_password'
                id='floating_password'
                className='block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor='floating_password'
                className='absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
              >
                Mot de passe
              </label>
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                disabled={loggingIn}
              >
                {loggingIn ? 'Connexion en cours...' : 'Connexion'}
              </button>
            </div>
          </form>

          <div className='mt-4'>
            <button
              onClick={() => setSignUpOpened(true)}
              className='text-blue-700 hover:text-blue-800 dark:text-blue-500'
            >
              Créer un compte
            </button>
          </div>
        </div>
      ) : (
        <div>
          <SignUp />
          <button
            onClick={() => setSignUpOpened(false)}
            className='text-blue-700 hover:text-blue-800 dark:text-blue-500 mt-4'
          >
            Retour
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
