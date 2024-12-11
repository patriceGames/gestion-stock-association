import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UiButton({icon, text, action, enabled, color}) {
  return (
    <button
    onClick={action} // Null pour ajouter une nouvelle réservation
    className={`flex px-4 py-2 m-1 items-center gap-x-1 rounded-md ${
        enabled
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : `${!(color) && "bg-[#EC751A] hover:bg-[#009EE0]"} 
           ${(color === "blue") && "bg-blue-500 hover:bg-blue-900"} 
           ${(color === "red") && "bg-red-500 hover:bg-red-900"} 
           ${(color === "grey") && "bg-gray-500 hover:bg-gray-600"} 
          text-white `
    }`}
    disabled={enabled} // Désactiver le bouton si la quantité disponible est 0
  >
    {icon && (<FontAwesomeIcon icon={icon} />)} {<UiTextLight text={text} />}
  </button>
  );
}

function UiTitleMain({ text, color }) {
  return <h1 className={`font-gobold text-3xl mb-3 font-semibold ${color? `text-${color}` : ""}`}>{text}</h1>;
}

function UiTitleSecondary({ text, color  }) {
  return <h2 className={`font-gobold text-2xl font-thin ${color? `text-${color}` : ""}`}>{text}</h2>;
}

function UiTextLight({ text, color}) {
  return <span className={`font-gotham text-base font-light ${color? `text-${color}` : ""}`}>{text}</span>;
}

function UiTextLightSmall({ text, color  }) {
  return <span className={`font-gotham text-base text-sm font-light ${color? `text-${color}` : ""}`}>{text}</span>;
}

function UiTextBook({ text, color  }) {
  return <span className={`font-gotham text-base ${color? `text-${color}` : ""}`}>{text}</span>;
}

function UiTextMedium({ text, color  }) {
  return <span className={`font-gotham text-base font-medium ${color? `text-${color}` : ""}`}>{text}</span>;
}

function UiTextBold({ text, color  }) {
  return <span className={`font-gotham text-base font-bold ${color? `text-${color}` : ""}`}>{text}</span>;
}

function UiModal({ children, onClose }){
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg relative max-w-md w-full">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

// Export des composants
export {
  UiButton,
  UiTitleMain,
  UiTitleSecondary,
  UiTextLight,
  UiTextLightSmall,
  UiTextBook,
  UiTextMedium,
  UiTextBold,
  UiModal,
};
