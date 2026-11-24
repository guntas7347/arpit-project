import { useContext, useEffect, useState } from "react";
import axios from "axios";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import {
  PersonOutline,
  SchoolOutlined,
  AddCircleOutline,
  CodeOutlined,
  Close as CloseIcon,
  SaveOutlined,
  CloudUploadOutlined,
} from "@material-ui/icons";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const MultifieldInput = (props) => {
  const { education, setEducation } = props;

  return (
    <div className="space-y-3">
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

      <div className="pt-1">
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

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

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
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
            }))
          );
        }
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

  const handleClose = () => {
    setOpen(false);
  };

  const editDetails = () => {
    setOpen(true);
  };

  const handleUpdate = () => {
    console.log(education);

    let updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

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
    setOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal details, education, skills, and documents
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <PersonOutline className="text-indigo-600" fontSize="small" />
                <h2 className="text-base font-bold text-slate-800">
                  Personal Information
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <SchoolOutlined className="text-indigo-600" fontSize="small" />
                <h2 className="text-base font-bold text-slate-800">
                  Education Details
                </h2>
              </div>

              <MultifieldInput
                education={education}
                setEducation={setEducation}
              />
            </div>

            {/* Skills Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <CodeOutlined className="text-indigo-600" fontSize="small" />
                <h2 className="text-base font-bold text-slate-800">Skills</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Skills
                </label>
                <div className="w-full rounded-xl bg-white border border-slate-300 p-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                  <div className="flex flex-wrap items-center gap-2">
                    {profileDetails.skills &&
                      profileDetails.skills.map((chip, index) => (
                        <span
                          key={`${chip}-${index}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                        >
                          <span>{chip}</span>
                          <button
                            type="button"
                            onClick={() => {
                              let skills = [...profileDetails.skills];
                              skills.splice(index, 1);
                              setProfileDetails({
                                ...profileDetails,
                                skills: skills,
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
                          setProfileDetails({
                            ...profileDetails,
                            skills: [
                              ...profileDetails.skills,
                              skillInput.trim(),
                            ],
                          });
                          setSkillInput("");
                        }
                      }}
                      placeholder="Type a skill and press Enter..."
                      className="flex-1 min-w-[160px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1 px-1.5"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Press enter to add skills
                </p>
              </div>
            </div>

            {/* File Uploads Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <CloudUploadOutlined
                  className="text-indigo-600"
                  fontSize="small"
                />
                <h2 className="text-base font-bold text-slate-800">
                  Documents &amp; Photo
                </h2>
              </div>

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
    </>
  );
};

export default Profile;