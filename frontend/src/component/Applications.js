import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  PersonOutline,
  WorkOutline,
  Schedule,
  EventNote,
  CheckCircleOutline,
  Star,
  StarBorder,
  Close as CloseIcon,
  AssignmentOutlined,
} from "@material-ui/icons";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const ApplicationTile = (props) => {
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);
  const [hoverRating, setHoverRating] = useState(null);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  const statusColor = colorSet[application.status] || "#64748B";
  const activeStars =
    hoverRating !== null ? hoverRating : rating === -1 ? 0 : rating;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 mb-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6">
        {/* Left Details Section */}
        <div className="flex-1 space-y-4">
          {/* Title & Recruiter */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {application.job.title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <PersonOutline style={{ fontSize: 16 }} className="text-slate-400" />
              <span>Posted By:</span>
              <span className="font-medium text-slate-700">
                {application.recruiter.name}
              </span>
            </div>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
              <WorkOutline className="text-indigo-500" fontSize="small" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Role
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {application.job.jobType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
              <span className="font-bold text-emerald-600 text-base">&#8377;</span>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Salary
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  &#8377; {application.job.salary} / mo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
              <Schedule className="text-indigo-500" fontSize="small" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Duration
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {application.job.duration !== 0
                    ? `${application.job.duration} month`
                    : `Flexible`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
              <EventNote className="text-slate-500" fontSize="small" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Applied On
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {appliedOn.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Joined Date */}
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <CheckCircleOutline style={{ fontSize: 16 }} className="text-emerald-600" />
              <span>Joined On: {joinedOn.toLocaleDateString()}</span>
            </div>
          ) : null}

          {/* Skills */}
          {application.job.skillsets && application.job.skillsets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {application.job.skillsets.map((skill, idx) => (
                <span
                  key={`${skill}-${idx}`}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/70"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Status & Rating Column */}
        <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 md:w-44 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          {/* Status Pill */}
          <div
            className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
            style={{
              backgroundColor: statusColor,
              color: "#ffffff",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-white/90" />
            <span>{application.status}</span>
          </div>

          {/* Rate Job Button */}
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <button
              type="button"
              onClick={() => {
                fetchRating();
                setOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Star style={{ fontSize: 16 }} className="text-amber-300" />
              <span>Rate Job</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Rating Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 sm:p-8 space-y-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Rate Your Experience
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {application.job.title}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {/* Interactive Star Picker */}
            <div className="py-4 bg-slate-50 rounded-xl border border-slate-100">
              <div
                className="inline-flex items-center gap-1.5"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeStars;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setHoverRating(starValue)}
                      onClick={() => setRating(starValue)}
                      className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none"
                      aria-label={`Rate ${starValue} stars`}
                    >
                      {isFilled ? (
                        <Star
                          className="text-amber-400"
                          style={{ fontSize: 36 }}
                        />
                      ) : (
                        <StarBorder
                          className="text-slate-300"
                          style={{ fontSize: 36 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-2">
                {activeStars > 0
                  ? `${activeStars} out of 5 stars`
                  : "Select a star rating"}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => changeRating()}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track the status of your submitted job applications
          </p>
        </div>

        {/* Applications List */}
        <div>
          {applications.length > 0 ? (
            applications.map((obj) => (
              <div key={obj._id}>
                <ApplicationTile application={obj} />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <AssignmentOutlined />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                No Applications Found
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Applications you submit will appear here along with their status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;