import { AlertCircle, X } from "lucide-react";

const ValidationErrorsModal = ({
  errors,
  onClose,
}: {
  errors: string[];
  onClose: () => void;
}) => {
  if (errors.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Validation Errors
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Please fix the following errors before activating the workflow:
          </p>
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start text-sm text-red-600">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorsModal;
