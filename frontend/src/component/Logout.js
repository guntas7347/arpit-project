import { useState, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { ExitToApp, Close as CloseIcon } from "@material-ui/icons";

import { SetPopupContext } from "../App";

const Logout = (props) => {
  const setPopup = useContext(SetPopupContext);
  const history = useHistory();
  const [loggedOut, setLoggedOut] = useState(false);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    setPopup({
      open: true,
      severity: "success",
      message: "Logged out successfully",
    });
    setLoggedOut(true);
  };

  const handleCancel = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push("/home");
    }
  };

  if (loggedOut) {
    return <Redirect to="/login" />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 sm:p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleCancel}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <ExitToApp fontSize="large" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Log out of Job Portal?
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          You will be signed out of your current session and redirected to the login screen.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 mt-7">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm hover:shadow transition-all"
          >
            <ExitToApp fontSize="small" />
            <span>Yes, Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;