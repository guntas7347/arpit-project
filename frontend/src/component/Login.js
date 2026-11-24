
import { useContext, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import WorkIcon from "@material-ui/icons/Work";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import SecurityIcon from "@material-ui/icons/Security";
import PeopleIcon from "@material-ui/icons/People";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const Login = () => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());
  const [loading, setLoading] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" },
  });

  const handleInput = (key, value) => {
    setLoginDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler((prev) => ({
      ...prev,
      [key]: {
        error: status,
        message,
      },
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const verified = !Object.values(inputErrorHandler).some(
      (item) => item.error
    );

    if (!verified) {
      setPopup({
        open: true,
        severity: "error",
        message: "Please enter valid details",
      });
      return;
    }

    if (!loginDetails.email || !loginDetails.password) {
      setPopup({
        open: true,
        severity: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(apiList.login, loginDetails);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("type", response.data.type);

      setLoggedin(isAuth());

      setPopup({
        open: true,
        severity: "success",
        message: "Logged in successfully",
      });
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loggedin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SECTION */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 p-12 text-white relative overflow-hidden">

          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-blue-400/10 rounded-full" />

          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-3 rounded-xl">
                <WorkIcon style={{ fontSize: 26 }} />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                HireSmart
              </span>
            </div>

            {/* Main heading */}
            <div className="mt-24">

              <p className="text-indigo-200 uppercase tracking-[0.25em] text-xs font-semibold">
                Your career starts here
              </p>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mt-5">
                Find the right
                <br />
                opportunity.
                <br />
                Build your future.
              </h1>

              <p className="text-indigo-100 mt-6 text-base leading-7 max-w-sm">
                Connect with opportunities, discover exciting careers,
                and take the next step towards your professional goals.
              </p>

            </div>
          </div>

          {/* Features */}
          <div className="relative z-10 space-y-5">

            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-3 rounded-xl">
                <PeopleIcon style={{ fontSize: 21 }} />
              </div>

              <div>
                <p className="font-semibold">Career opportunities</p>
                <p className="text-indigo-200 text-sm">
                  Discover opportunities that match your goals.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-3 rounded-xl">
                <SecurityIcon style={{ fontSize: 21 }} />
              </div>

              <div>
                <p className="font-semibold">Simple and secure</p>
                <p className="text-indigo-200 text-sm">
                  A smoother way to manage your job search.
                </p>
              </div>
            </div>

            <p className="text-indigo-200 text-xs pt-6 border-t border-white/20">
              © {new Date().getFullYear()} HireSmart. All rights reserved.
            </p>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center p-7 sm:p-12 lg:p-16">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-2 mb-10 text-indigo-700">
              <WorkIcon style={{ fontSize: 27 }} />

              <span className="text-2xl font-bold">
                HireSmart
              </span>
            </div>

            {/* Heading */}
            <div className="mb-9">

              <p className="text-sm font-semibold text-indigo-600 mb-3">
                WELCOME BACK
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h2>

              <p className="text-slate-500 mt-3 text-sm leading-6">
                Enter your credentials to access your HireSmart account.
              </p>

            </div>

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>

                <EmailInput
                  label="Email"
                  value={loginDetails.email}
                  onChange={(event) =>
                    handleInput("email", event.target.value)
                  }
                  inputErrorHandler={inputErrorHandler}
                  handleInputError={handleInputError}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <PasswordInput
                  label="Password"
                  value={loginDetails.password}
                  onChange={(event) =>
                    handleInput("password", event.target.value)
                  }
                  className="w-full"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowForwardIcon style={{ fontSize: 18 }} />
                  </>
                )}
              </button>

            </form>

            {/* Footer */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />

              <span className="text-xs text-slate-400">
                SECURE ACCESS
              </span>

              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              By signing in, you agree to use HireSmart responsibly.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
