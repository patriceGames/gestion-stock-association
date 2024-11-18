import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc , query, where,} from 'firebase/firestore';

function EmployeeManagement({ companyId, currentUser, currentUserDetail}) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeRole, setNewEmployeeRole] = useState('utilisateur');

  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (!currentUser) {
          console.error('No user is currently authenticated.');
          return;
        }
        const employeesRef = collection(db, 'roles');
        const employeeDocs = await getDocs(employeesRef);
        const employeeList = employeeDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setEmployees(employeeList);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés :', error);
      }
      setLoading(false);
    };
  
    fetchEmployees();
  }, [currentUser]);

  const handleAddEmployee = async () => {
    if (!newEmployeeEmail) {
      alert("Veuillez entrer une adresse email.");
      return;
    }

    try {
      // Création d'une requête pour chercher un utilisateur par son email
      const usersCollectionRef = collection(db, 'users');
      const userQuery = query(usersCollectionRef, where('email', '==', newEmployeeEmail));
      const querySnapshot = await getDocs(userQuery);
    
      if (!querySnapshot.empty) {
        // L'utilisateur existe
        const newEmployeeData = {
          email: newEmployeeEmail,
          role: newEmployeeRole,
        };
    
        // Ajout de l'employé à la collection des employés de l'entreprise
        await setDoc(doc(db, 'roles', querySnapshot.docs[0].id), newEmployeeData);
    
        setEmployees([...employees, { id: querySnapshot.docs[0].id, ...newEmployeeData }]);
        alert("Employé ajouté avec succès !");
        setShowPopup(false);
      } else {
        alert("L'adresse email n'existe pas dans la base. \nAssurez vous que la personne a correctement créé son compte et que l'email renseigné est correcte");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé :", error);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      const employeeRef = doc(db, 'roles', user.id);
      await updateDoc(employeeRef, { role: newRole });

      setEmployees((prevData) =>
        prevData.map((employee) =>
          employee.id === user.id ? { ...employee, role: newRole } : employee
        )
      );

      console.log(`Rôle de l'utilisateur ${user.email} mis à jour en ${newRole}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle :', error);
    }
  };

  const handleDeleteEmployee = async (employeeToDelete) => {
    try {
      const employeeRef = doc(db, 'roles', employeeToDelete.id);
      await deleteDoc(employeeRef);

      setEmployees((prevData) => prevData.filter((employee) => employee.id !== employeeToDelete.id));
      alert(`L'employé ${employeeToDelete.email} a été supprimé avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé :", error);
    }
  };

  if (loading) {
    return <p>Chargement des employés...</p>;
  }

  return (
    <div className="employee-table">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Rôle</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="py-2 px-4 border-b">{employee.email}</td>
              <td className="py-2 px-4 border-b">
                {currentUserDetail?.role === 'admin' && currentUser.uid !== employee.id ? (
                  <select
                    value={employee.role}
                    onChange={(e) => handleRoleChange(employee, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="admin">Admin</option>
                    <option value="utilisateur">Utilisateur</option>
                  </select>
                ) : (
                  <span>{employee.role}</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {currentUserDetail?.role === 'admin' && currentUser.uid !== employee.id && (
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteEmployee(employee)}
                  >
                    Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentUserDetail?.role === 'admin' &&(<button
        className="mt-4 bg-[#EC751A] hover:bg-[#009EE0] text-white px-4 py-2 rounded"
        onClick={() => setShowPopup(true)}
      >
        Ajouter un employé
      </button>)}

      {showPopup && (
        <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="popup-content bg-white p-6 rounded shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Ajouter un nouvel employé</h3>
            <label className="block mb-2">
              Adresse Email:
              <input
                type="email"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              Rôle:
              <select
                value={newEmployeeRole}
                onChange={(e) => setNewEmployeeRole(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              >
                <option value="utilisateur">Utilisateur</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleAddEmployee}
            >
              Ajouter
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowPopup(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;
