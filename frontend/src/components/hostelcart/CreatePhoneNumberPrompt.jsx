import { useNavigate } from "react-router-dom";

export default function CreatePhoneNumberPrompt({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Phone number required</h3>
      <p className="text-sm text-gray-600 mb-4">
        You need to set your phone number before adding an item. This helps other users contact you.
      </p>

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => onClose?.()}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            onClose?.();
            navigate("/profile");
          }}
        >
          Set phone number
        </button>
      </div>
    </div>
  );
}
