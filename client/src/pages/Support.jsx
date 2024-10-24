import React from "react";

function Support() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Soutien à KOD_ElDragon</h1>
      <p className="mb-6">Soutenez-nous via PayPal ou par carte bancaire.</p>
      <button className="bg-blue-500 px-4 py-2 mr-4 rounded hover:bg-blue-400">
        Faire un don via PayPal
      </button>
      <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-400">
        Faire un don par Carte Bancaire
      </button>
    </div>
  );
}

export default Support;
