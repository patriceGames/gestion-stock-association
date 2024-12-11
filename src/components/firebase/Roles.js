import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,

  } from "firebase/firestore";
  import { db } from "./Base.js";

async function AddEmployee(newEmployeeEmail, newEmployeeRole) {
    if (!newEmployeeEmail) {
      alert("Veuillez entrer une adresse email.");
      return;
    }

    try {
      const userDocRef = doc(db, "roles", newEmployeeEmail);
      const docSnapshot = await getDoc(userDocRef);

      if (!docSnapshot.exists()) {
        // Le document n'existe pas, ajoutez le nouvel employé
        const newEmployeeData = {
          role: newEmployeeRole, // Seul le rôle est stocké
        };

        // Crée ou met à jour le document avec setDoc
        await setDoc(userDocRef, newEmployeeData);

        console.log("Employé ajouté avec succès !");
        return newEmployeeData;
      } else {
        alert(
          "L'adresse email renseignée possède déjà des autorisations, modifier ou supprimer les autorisations existantes en cas de necessité"
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé :", error);
    }
  };

  async function GetEmployees(currentUser){
    try {
      if (!currentUser) {
        console.error("No user is currently authenticated.");
        return;
      }
      const employeesRef = collection(db, "roles");
      const employeeDocs = await getDocs(employeesRef);
      const employeeList = employeeDocs.docs.map((doc) => ({
        email: doc.id,
        ...doc.data(),
      }));

      return employeeList;
    } catch (error) {
      console.error("Erreur lors de la récupération des employés :", error);
    }
  };

  async function ChangeEmployeeRole(employeeToEdit, newRole){
    try {
      const employeeRef = doc(db, "roles", employeeToEdit.email);
      await updateDoc(employeeRef, { role: newRole });
      console.log(
        `Rôle de l'utilisateur ${employeeToEdit.email} mis à jour en ${newRole}`
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
    }
  };

  async function DeleteEmployee(employeeToDelete) {
    try {
      const employeeRef = doc(db, "roles", employeeToDelete.email);
      await deleteDoc(employeeRef);
      console.log(`L'employé ${employeeToDelete.email} a été supprimé avec succès.`);

    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé :", error);
    }
  };

  export {AddEmployee, GetEmployees, ChangeEmployeeRole, DeleteEmployee}