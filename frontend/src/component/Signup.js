import { useState, useContext } from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import {
  PersonOutline,
  BusinessCenterOutlined,
  SchoolOutlined,
  AddCircleOutline,
  CodeOutlined,
  Close as CloseIcon,
  HowToRegOutlined,
  PhoneOutlined,
  SubjectOutlined,
} from "@material-ui/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const MultifieldInput = (props) => {
  const { education, setEducation } = props;

  return (
    <div className="space-y-3 w-full">
      {education.map((obj, key) => (
        <div
          key={key}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80"
        >
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {`Institution Name #${key + 1}`}
            </label>
            <input
              type="text"
              placeholder={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Start Year
            </label>
            <input
              type="number"
              placeholder="YYYY"
              value={obj.startYear}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
              className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              End Year
            </label>
            <input
              type="number"
              placeholder="YYYY"
              value={obj.endYear}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
              className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      ))}

      <div>
        <button
          type="button"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 text-sm font-semibold transition-all"
        >
          <AddCircleOutline fontSize="small" />
          <span>Add another institution details</span>
        </button>
      </div>
    </div>
  );
};

const Login = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());
  const [skillInput, setSkillInput] = useState("");

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    console.log(education);

    let updatedDetails = {
      ...signupDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    console.log(updatedDetails);

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const bioWordCount = signupDetails.bio
    .split(" ")
    .filter(function (n) {
      return n != "";
    }).length;

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
            <HowToRegOutlined />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500">
            Join Job Portal as an applicant or recruiter
          </p>
        </div>

        {/* Category Switcher */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-xl bg-slate-100 border border-slate-200/70">
            <button
              type="button"
              onClick={() => handleInput("type", "applicant")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                signupDetails.type === "applicant"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PersonOutline fontSize="small" />
              <span>Applicant</span>
            </button>
            <button
              type="button"
              onClick={() => handleInput("type", "recruiter")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                signupDetails.type === "recruiter"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BusinessCenterOutlined fontSize="small" />
              <span>Recruiter</span>
            </button>
          </div>
        </div>

        {/* Core Account Fields */}
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={signupDetails.name}
              onChange={(event) => handleInput("name", event.target.value)}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("name", true, "Name is required");
                } else {
                  handleInputError("name", false, "");
                }
              }}
              className={`w-full rounded-xl bg-white border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                inputErrorHandler.name.error
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {inputErrorHandler.name.error && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {inputErrorHandler.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <EmailInput
              label="Email"
              value={signupDetails.email}
              onChange={(event) => handleInput("email", event.target.value)}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              className="w-full"
              required={true}
            />
          </div>

          {/* Password */}
          <div>
            <PasswordInput
              label="Password"
              value={signupDetails.password}
              onChange={(event) => handleInput("password", event.target.value)}
              className="w-full"
              error={inputErrorHandler.password.error}
              helperText={inputErrorHandler.password.message}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("password", true, "Password is required");
                } else {
                  handleInputError("password", false, "");
                }
              }}
            />
          </div>
        </div>

        {/* Role-Specific Fields */}
        {signupDetails.type === "applicant" ? (
          <div className="space-y-6 pt-2 border-t border-slate-100">
            {/* Education */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <SchoolOutlined className="text-indigo-600" fontSize="small" />
                <h3 className="text-sm font-bold">Education Details</h3>
              </div>
              <MultifieldInput
                education={education}
                setEducation={setEducation}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <CodeOutlined className="text-indigo-600" fontSize="small" />
                <label className="text-sm font-bold">Skills</label>
              </div>
              <div className="w-full rounded-xl bg-white border border-slate-300 p-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <div className="flex flex-wrap items-center gap-2">
                  {signupDetails.skills.map((chip, index) => (
                    <span
                      key={`${chip}-${index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                    >
                      <span>{chip}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSkills = signupDetails.skills.filter(
                            (_, i) => i !== index
                          );
                          setSignupDetails({
                            ...signupDetails,
                            skills: updatedSkills,
                          });
                        }}
                        className="text-indigo-400 hover:text-indigo-700 focus:outline-none"
                        aria-label={`Remove ${chip}`}
                      >
                        <CloseIcon style={{ fontSize: 14 }} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && skillInput.trim() !== "") {
                        e.preventDefault();
                        setSignupDetails({
                          ...signupDetails,
                          skills: [...signupDetails.skills, skillInput.trim()],
                        });
                        setSkillInput("");
                      }
                    }}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 min-w-[160px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1 px-1.5"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Press enter to add skills
              </p>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <FileUploadInput
                  className="w-full"
                  label="Resume (.pdf)"
                  icon={<DescriptionIcon />}
                  uploadTo={apiList.uploadResume}
                  handleInput={handleInput}
                  identifier={"resume"}
                />
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <FileUploadInput
                  className="w-full"
                  label="Profile Photo (.jpg/.png)"
                  icon={<FaceIcon />}
                  uploadTo={apiList.uploadProfileImage}
                  handleInput={handleInput}
                  identifier={"profile"}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 pt-2 border-t border-slate-100">
            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <SubjectOutlined
                    className="text-indigo-600"
                    style={{ fontSize: 16 }}
                  />
                  <span>Bio (upto 250 words)</span>
                </label>
                <span
                  className={`text-xs font-medium ${
                    bioWordCount >= 240 ? "text-amber-600" : "text-slate-400"
                  }`}
                >
                  {bioWordCount} / 250 words
                </span>
              </div>
              <textarea
                rows={6}
                placeholder="Tell applicants about yourself or your company..."
                value={signupDetails.bio}
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

            {/* Phone Input */}
            <div>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                <PhoneOutlined
                  className="text-indigo-600"
                  style={{ fontSize: 16 }}
                />
                <span>Contact Number</span>
              </label>
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
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 space-y-4">
          <button
            type="button"
            onClick={() => {
              signupDetails.type === "applicant"
                ? handleLogin()
                : handleLoginRecruiter();
            }}
            className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow active:scale-[0.99] transition-all"
          >
            Signup
          </button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;