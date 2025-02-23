import React from "react";

const LogoutModal = ({
  message,
  smallMessage,
  onConfirm,
  onCancel,
  after,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full max-w-md text-center px-6">
        <h1 className="text-2xl font-bold text-green-700 mb-8">GreenMart</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
        <p className="text-gray-600 mb-8">{smallMessage}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onConfirm();
              if (after) after();
            }}
            className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            sign out
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 text-green-700 bg-white border border-green-700 rounded-lg hover:bg-green-50 transition-colors"
          >
            keep me signed in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
