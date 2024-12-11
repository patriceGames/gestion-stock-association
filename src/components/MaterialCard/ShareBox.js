import React from "react";
import { UiButton } from "../UI/Ui";

function ShareBox({ material, copyToClipboard, closeShareBox }) {
  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-96 bg-white p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Partager ce produit</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={`${window.location.origin}/material/${material.id}`}
          readOnly
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <UiButton action={copyToClipboard} text={"Copier"} color={"blue"}/>
      </div>
      <button className="mt-4 text-gray-500 underline" onClick={closeShareBox}>
        Fermer
      </button>
    </div>
  );
}

export default ShareBox;
