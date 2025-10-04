// LoginPromptModal.jsx
import { useNavigate } from "react-router-dom";

export const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-bold mb-2">Login required</h2>
        <p className="mb-4">You need to log in to continue.</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => {
              onClose?.();
              navigate("/home", { replace: true }); // Cancel -> home
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              onClose?.();
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
