import React, { useEffect, useState } from "react";
import { UpdateUserProfile, UpdateUserPassword } from "../firebase";
import { UiSecondaryCard, UiTitleMain } from "../UI/Ui";

const Profile = ({ currentUser }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Charger les données utilisateur depuis Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        setForm((prevForm) => ({
          ...prevForm,
          firstName: currentUser.firstName || "",
          lastName: currentUser.lastName || "",
          email: currentUser.email || "",
        }));
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur :",
          error
        );
        setMessage("Impossible de charger les informations utilisateur.");
        setIsError(true);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      // Validation simple
      if (!form.firstName && !form.lastName && !form.password) {
        throw new Error("Veuillez remplir nom et prénom");
      }

      // Mettre à jour le profil utilisateur
      if (form.firstName || form.lastName) {
        const updateData = {};
        if (form.firstName) updateData.firstName = form.firstName;
        if (form.lastName) updateData.lastName = form.lastName;

        await UpdateUserProfile(currentUser.uid, updateData);
      }

      // Mettre à jour le mot de passe
      if (form.password) {
        if (form.password !== form.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        await UpdateUserPassword(currentUser, form.password);
      }

      setMessage("Vos informations ont été mises à jour avec succès !");
    } catch (error) {
      setMessage(error.message || "Une erreur est survenue.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UiSecondaryCard>
        <UiTitleMain text={"Informations personnelles"} />
        {message && (
          <div
            className={`mb-4 p-2 rounded ${
              isError
                ? "bg-red-200 text-red-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Champ dummy pour éviter l'auto-complétion */}
          <input
            type="text"
            style={{ display: "none" }}
            autoComplete="username"
          />
          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Votre nom"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Votre prénom"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Votre email"
              disabled
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Nouveau mot de passe"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              placeholder="Confirmez le nouveau mot de passe"
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "En cours..." : "Sauvegarder"}
          </button>
        </form>
      </UiSecondaryCard>
  );
};

export default Profile;
