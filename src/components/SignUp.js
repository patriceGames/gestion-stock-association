import React, { useState } from 'react';
import { signup } from './firebase';  // Importer la fonction signup

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Inscription de l'utilisateur et envoi de l'email de vérification
      await signup(email, password);
      alert("Inscription réussie ! Un email de confirmation a été envoyé.");
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            // Si l'email est déjà utilisé, informer l'utilisateur
            alert('Cette adresse email est déjà associée à un compte.');
          } else {
            // Gérer d'autres erreurs si besoin
            console.error("Erreur lors de l'inscription :", error);
            alert("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
          }
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Créer un compte</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Mot de passe" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default Signup;
