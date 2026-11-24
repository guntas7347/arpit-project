import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  WorkOutline,
  HomeOutlined,
  AddCircleOutline,
  BusinessCenterOutlined,
  PeopleOutline,
  PersonOutline,
  ExitToApp,
  AssignmentOutlined,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@material-ui/icons";

import isAuth, { userType } from "../lib/isAuth";

const Navbar = (props) => {
  let history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (location) => {
    console.log(location);
    setMobileOpen(false);
    history.push(location);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleClick(isAuth() ? "/home" : "/")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <WorkOutline fontSize="small" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Job<span className="text-indigo-600">Portal</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {isAuth() ? (
              userType() === "recruiter" ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleClick("/home")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
                  >
                    <HomeOutlined fontSize="small" />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClick("/addjob")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
                  >
                    <AddCircleOutline fontSize="small" />
                    <span>Add Jobs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClick("/myjobs")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
                  >
                    <BusinessCenterOutlined fontSize="small" />
                    <span>My Jobs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClick("/employees")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
                  >
                    <PeopleOutline fontSize="small" />
                    <span>Employees</span>
                  </button>

                  <div className="h-5 w-px bg-slate-200 mx-1.5" />

                  <button
                    type="button"
                    onClick={() => handleClick("/profile")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                  >
                    <PersonOutline fontSize="small" />
                    <span>Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClick("/logout")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <ExitToApp fontSize="small" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleClick("/home")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
                  >
                    <HomeOutlined fontSize="small" />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClick("/applications")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
                  >
                    <AssignmentOutlined fontSize="small" />
                    <span>Applications</span>
                  </button>

                  <div className="h-5 w-px bg-slate-200 mx-1.5" />

                  <button
                    type="button"
                    onClick={() => handleClick("/profile")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                  >
                    <PersonOutline fontSize="small" />
                    <span>Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClick("/logout")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <ExitToApp fontSize="small" />
                    <span>Logout</span>
                  </button>
                </>
              )
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleClick("/login")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleClick("/signup")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
                >
                  Signup
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {isAuth() ? (
            userType() === "recruiter" ? (
              <>
                <button
                  type="button"
                  onClick={() => handleClick("/home")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <HomeOutlined fontSize="small" />
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleClick("/addjob")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <AddCircleOutline fontSize="small" />
                  <span>Add Jobs</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleClick("/myjobs")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <BusinessCenterOutlined fontSize="small" />
                  <span>My Jobs</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleClick("/employees")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <PeopleOutline fontSize="small" />
                  <span>Employees</span>
                </button>
                <div className="border-t border-slate-100 my-1.5" />
                <button
                  type="button"
                  onClick={() => handleClick("/profile")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  <PersonOutline fontSize="small" />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleClick("/logout")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <ExitToApp fontSize="small" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleClick("/home")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <HomeOutlined fontSize="small" />
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleClick("/applications")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <AssignmentOutlined fontSize="small" />
                  <span>Applications</span>
                </button>
                <div className="border-t border-slate-100 my-1.5" />
                <button
                  type="button"
                  onClick={() => handleClick("/profile")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  <PersonOutline fontSize="small" />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleClick("/logout")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <ExitToApp fontSize="small" />
                  <span>Logout</span>
                </button>
              </>
            )
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleClick("/login")}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleClick("/signup")}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Signup
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;