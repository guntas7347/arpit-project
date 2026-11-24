import { useContext, useState } from "react";
import axios from "axios";
import {
  WorkOutline,
  CodeOutlined,
  Schedule,
  EventAvailable,
  PeopleOutline,
  AssignmentIndOutlined,
  AddCircleOutline,
  Close as CloseIcon,
} from "@material-ui/icons";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const CreateJobs = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [skillInput, setSkillInput] = useState("");

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
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
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
        });
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

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Add Job
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish a new job listing and start receiving applications
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Section 1: Role & Skills */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <WorkOutline className="text-indigo-600" fontSize="small" />
              <h2 className="text-base font-bold text-slate-800">
                Role &amp; Requirements
              </h2>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend React Developer"
                value={jobDetails.title}
                onChange={(event) => handleInput("title", event.target.value)}
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Skills Chip Input */}
            <div>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                <CodeOutlined
                  className="text-indigo-600"
                  style={{ fontSize: 16 }}
                />
                <span>Skills</span>
              </label>
              <div className="w-full rounded-xl bg-white border border-slate-300 p-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <div className="flex flex-wrap items-center gap-2">
                  {jobDetails.skillsets.map((chip, index) => (
                    <span
                      key={`${chip}-${index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                    >
                      <span>{chip}</span>
                      <button
                        type="button"
                        onClick={() => {
                          let skillsets = [...jobDetails.skillsets];
                          skillsets.splice(index, 1);
                          setJobDetails({
                            ...jobDetails,
                            skillsets: skillsets,
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
                        setJobDetails({
                          ...jobDetails,
                          skillsets: [
                            ...jobDetails.skillsets,
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

          {/* Section 2: Compensation & Schedule */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Schedule className="text-indigo-600" fontSize="small" />
              <h2 className="text-base font-bold text-slate-800">
                Compensation &amp; Schedule
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Job Type
                </label>
                <select
                  value={jobDetails.jobType}
                  onChange={(event) => {
                    handleInput("jobType", event.target.value);
                  }}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Work From Home">Work From Home</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Duration
                </label>
                <select
                  value={jobDetails.duration}
                  onChange={(event) => {
                    handleInput("duration", Number(event.target.value));
                  }}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value={0}>Flexible</option>
                  <option value={1}>1 Month</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                  <option value={4}>4 Months</option>
                  <option value={5}>5 Months</option>
                  <option value={6}>6 Months</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Salary */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Salary (per month)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    &#8377;
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={jobDetails.salary}
                    onChange={(event) => {
                      handleInput("salary", event.target.value);
                    }}
                    className="w-full rounded-xl bg-white border border-slate-300 pl-8 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  <EventAvailable
                    className="text-indigo-600"
                    style={{ fontSize: 15 }}
                  />
                  <span>Application Deadline</span>
                </label>
                <input
                  type="datetime-local"
                  value={jobDetails.deadline}
                  onChange={(event) => {
                    handleInput("deadline", event.target.value);
                  }}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Capacity */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <PeopleOutline className="text-indigo-600" fontSize="small" />
              <h2 className="text-base font-bold text-slate-800">
                Application Limits
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Max Applicants */}
              <div>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  <PeopleOutline
                    className="text-slate-400"
                    style={{ fontSize: 15 }}
                  />
                  <span>Maximum Number Of Applicants</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={jobDetails.maxApplicants}
                  onChange={(event) => {
                    handleInput("maxApplicants", event.target.value);
                  }}
                  className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Positions Available */}
              <div>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  <AssignmentIndOutlined
                    className="text-slate-400"
                    style={{ fontSize: 15 }}
                  />
                  <span>Positions Available</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={jobDetails.maxPositions}
                  onChange={(event) => {
                    handleInput("maxPositions", event.target.value);
                  }}
                  className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => handleUpdate()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow active:scale-[0.99] transition-all"
            >
              <AddCircleOutline fontSize="small" />
              <span>Create Job</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobs;