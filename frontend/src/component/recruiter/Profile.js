import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import {
  PersonOutline,
  SubjectOutlined,
  PhoneOutlined,
  SaveOutlined,
} from "@material-ui/icons";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...profileDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profileDetails,
        contactNumber: "",
      };
    }

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  const bioWordCount = (profileDetails.bio || "")
    .split(" ")
    .filter(function (n) {
      return n != "";
    }).length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update your recruiter profile, bio, and contact details
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <PersonOutline className="text-indigo-600" fontSize="small" />
              <h2 className="text-base font-bold text-slate-800">
                Recruiter Details
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name or organization"
                value={profileDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <SubjectOutlined className="text-indigo-600" fontSize="small" />
                <h2 className="text-base font-bold text-slate-800">
                  Bio (upto 250 words)
                </h2>
              </div>
              <span
                className={`text-xs font-medium ${
                  bioWordCount >= 240 ? "text-amber-600" : "text-slate-400"
                }`}
              >
                {bioWordCount} / 250 words
              </span>
            </div>

            <div>
              <textarea
                rows={8}
                placeholder="Write a brief overview about yourself or your company..."
                value={profileDetails.bio}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Contact Number Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <PhoneOutlined className="text-indigo-600" fontSize="small" />
              <h2 className="text-base font-bold text-slate-800">
                Contact Number
              </h2>
            </div>

            <div className="w-full">
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputStyle={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "0.75rem",
                  borderColor: "#cbd5e1",
                  fontSize: "0.875rem",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => handleUpdate()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow active:scale-[0.99] transition-all"
            >
              <SaveOutlined fontSize="small" />
              <span>Update Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;