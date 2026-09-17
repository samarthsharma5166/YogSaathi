import { AlertTriangle, Loader2 } from "lucide-react";
const ConfirmationPopUp = ({
  confirmHandler,
  closeHandler,
  title = "Confirm Deletion",
  message = "Are you sure you want to proceed?",
  subMessage,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  isDanger = true,
}) => {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex justify-center items-center p-4"
      onClick={() => {
        if (!isLoading && closeHandler) closeHandler();
      }}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isDanger ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {message}
            </p>
            {subMessage && (
              <p className="mt-2 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5">
                {subMessage}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeHandler}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={confirmHandler}
            disabled={isLoading}
            className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200"
                : "bg-green-600 hover:bg-green-700 shadow-sm shadow-green-200"
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopUp;