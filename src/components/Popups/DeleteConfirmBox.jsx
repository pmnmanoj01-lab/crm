import ReactDOM from "react-dom";
import { X } from "lucide-react";

const DeleteConfirmBox = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/90  flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {title || "Are you sure?"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-600 cursor-pointer hover:text-gray-900"
          >
            <X size={22} />
          </button>
        </div>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 cursor-pointer rounded-lg border bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmBox;
