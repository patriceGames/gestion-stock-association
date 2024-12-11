import React, { useState, useEffect } from "react";
import {
  AddEmployee,
  ChangeEmployeeRole,
  GetEmployees,
  DeleteEmployee,
} from "./firebase";
import { UiButton, UiTextBold, UiTextLight, UiTitleMain } from "./UI/Ui";

function EmployeeManagement({ currentUser }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("utilisateur");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeList = await GetEmployees(currentUser);
        setEmployees(employeeList);
      } catch (error) {
        console.error("Erreur lors de la récupération des employés :", error);
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
    const newEmployeeData = await AddEmployee(
      newEmployeeEmail,
      newEmployeeRole
    );

    // Met à jour l'état local avec le nouvel employé
    setEmployees((prevEmployees) => [
      ...prevEmployees,
      { id: newEmployeeEmail, email: newEmployeeEmail, ...newEmployeeData },
    ]);
    setShowPopup(false);
  };

  const handleRoleChange = async (employeeToEdit, newRole) => {
    await ChangeEmployeeRole(employeeToEdit, newRole);
    setEmployees((prevData) =>
      prevData.map((employee) =>
        employee.email === employeeToEdit.email
          ? { ...employee, role: newRole }
          : employee
      )
    );
  };

  const handleDeleteEmployee = async (employeeToDelete) => {
    await DeleteEmployee(employeeToDelete);

    setEmployees((prevData) =>
      prevData.filter((employee) => employee.id !== employeeToDelete.id)
    );
  };

  if (loading) {
    return <p>Chargement des employés...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-md rounded-lg">
      <UiTitleMain text={"Droits et Accès"} />
        <div className="employee-table">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-2 text-left border-b">
                  <UiTextBold text={"Email"} />
                </th>
                <th className="py-2 px-2 text-left border-b">
                  <UiTextBold text={"Rôle"} />
                </th>
                <th className="py-2 px-2 text-left border-b">
                  <UiTextBold text={"Actions"} />
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.email}>
                  <td className="py-2 px-2 border-b">{employee.email}</td>
                  <td className="py-2 px-2 border-b">
                    {currentUser?.role === "admin" &&
                    currentUser.email !== employee.email ? (
                      <select
                        value={employee.role}
                        onChange={(e) =>
                          handleRoleChange(employee, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="utilisateur">Utilisateur</option>
                      </select>
                    ) : (
                      <span>{employee.role}</span>
                    )}
                  </td>
                  <td className="py-2 px-2 border-b">
                    {currentUser?.role === "admin" &&
                      currentUser.email !== employee.email && (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleDeleteEmployee(employee)}
                        >
                          <UiTextLight text={"Supprimer"} />
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          {currentUser?.role === "admin" && (
            <UiButton
              text={" Ajouter un employé"}
              action={() => setShowPopup(true)}
            />
          )}

          {showPopup && (
            <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="popup-content bg-white p-6 rounded shadow-lg relative">
                <h3 className="text-lg font-semibold mb-4">
                  Ajouter un nouvel employé
                </h3>
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
                <div className="flex justify-end">
                  <UiButton
                    text={" Annuler"}
                    action={() => setShowPopup(false)}
                    color={"red"}
                  />
                  <UiButton
                    text={" Ajouter"}
                    action={handleAddEmployee}
                    color={"blue"}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeManagement;
