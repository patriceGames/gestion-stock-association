import React, { useState } from 'react';
import { signup } from './firebase';  // Importer la fonction signup
import { UiButton, UiTitleSecondary } from './UI/Ui';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingUp, setSigningUp] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setSigningUp(true);
    try {
      // Inscription de l'utilisateur et envoi de l'email de vérification
      await signup(email, password);
      alert("Inscription réussie ! Un email de confirmation vous a été envoyé.");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Si l'email est déjà utilisé, informer l'utilisateur
        alert('Cette adresse email est déjà associée à un compte.');
      } else {
        // Gérer d'autres erreurs si besoin
        console.error("Erreur lors de l'inscription :", error);
        alert("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <form className='w-full'>
      <UiTitleSecondary text={"Créer un compte"} />
      <div className='relative z-0 my-6 w-full group'>
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
        <UiButton text={signingUp ? "Inscription en cours..." : "S'inscrire"} action={handleSignup} enabled={signingUp}/>
      </div>
    </form>
  );
};

export default Signup;
