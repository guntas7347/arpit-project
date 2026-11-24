import { useState, useEffect, useContext } from "react";
import axios from "axios";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  WorkOutline,
  EventNote,
  DescriptionOutlined,
  GetApp,
  CheckCircleOutline,
  Star,
  StarBorder,
  Close as CloseIcon,
  PersonOutline,
  PeopleOutline,
  WarningRounded,
} from "@material-ui/icons";

import { SetPopupContext } from "../../App";

import apiList, { server } from "../../lib/apiList";

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;

  if (!open) return null;

  const sortFields = [
    { key: "jobApplicant.name", id: "name", label: "Name" },
    { key: "job.title", id: "jobTitle", label: "Job Title" },
    { key: "dateOfJoining", id: "dateOfJoining", label: "Date of Joining" },
    { key: "jobApplicant.rating", id: "rating", label: "Rating" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FilterListIcon className="text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Sort Employees</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Sort Options */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Sort By
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortFields.map((field) => {
              const isActive = searchOptions.sort[field.key].status;
              const isDesc = searchOptions.sort[field.key].desc;
              return (
                <div
                  key={field.key}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all ${
                    isActive
                      ? "border-indigo-500 bg-indigo-50/60"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      name={field.id}
                      id={field.id}
                      checked={isActive}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            [field.key]: {
                              ...searchOptions.sort[field.key],
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium text-slate-700 cursor-pointer select-none"
                    >
                      {field.label}
                    </label>
                  </div>
                  <button
                    type="button"
                    disabled={!isActive}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          [field.key]: {
                            ...searchOptions.sort[field.key],
                            desc: !searchOptions.sort[field.key].desc,
                          },
                        },
                      });
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "text-indigo-600 hover:bg-indigo-100"
                        : "text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    {isDesc ? (
                      <ArrowDownwardIcon fontSize="small" />
                    ) : (
                      <ArrowUpwardIcon fontSize="small" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => getData()}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicationTile = (props) => {
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [openEndJob, setOpenEndJob] = useState(false);
  const [rating, setRating] = useState(application.jobApplicant.rating);
  const [hoverRating, setHoverRating] = useState(null);
  const [imgError, setImgError] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, applicantId: application.jobApplicant.userId },
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
        // fetchRating();
        getData();
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
        // fetchRating();
        getData();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEndJob = () => {
    setOpenEndJob(false);
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

  const getResume = () => {
    if (
      application.jobApplicant.resume &&
      application.jobApplicant.resume !== ""
    ) {
      const address = `${server}${application.jobApplicant.resume}`;
      console.log(address);
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
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
        handleCloseEndJob();
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
        handleCloseEndJob();
      });
  };

  const renderReadOnlyRating = (val) => {
    const filled = val !== -1 ? Math.round(val) : 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= filled ? (
            <Star key={star} className="text-amber-400" style={{ fontSize: 18 }} />
          ) : (
            <StarBorder
              key={star}
              className="text-slate-300"
              style={{ fontSize: 18 }}
            />
          )
        )}
        <span className="ml-1.5 text-xs font-medium text-slate-500">
          {val !== -1 ? Number(val).toFixed(1) : "Unrated"}
        </span>
      </div>
    );
  };

  const activeStars =
    hoverRating !== null ? hoverRating : rating === -1 ? 0 : rating;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 mb-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-6">
        {/* Avatar + Applicant Info */}
        <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
          {/* Profile Avatar */}
          <div className="shrink-0 mx-auto sm:mx-0">
            {application.jobApplicant.profile && !imgError ? (
              <img
                src={`${server}${application.jobApplicant.profile}`}
                alt={application.jobApplicant.name}
                onError={() => setImgError(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400">
                <PersonOutline style={{ fontSize: 44 }} />
              </div>
            )}
          </div>

          {/* Applicant Details */}
          <div className="flex-1 w-full space-y-3.5">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {application.jobApplicant.name}
              </h2>
              <div className="mt-1 flex justify-center sm:justify-start">
                {renderReadOnlyRating(application.jobApplicant.rating)}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                <WorkOutline className="text-indigo-500" fontSize="small" />
                <div className="truncate">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Job Title
                  </p>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {application.job.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                <PeopleOutline className="text-indigo-500" fontSize="small" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Role
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    {application.job.jobType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                <EventNote className="text-slate-500" fontSize="small" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Applied On
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    {appliedOn.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* SOP Box */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-700 mr-1.5 inline-flex items-center gap-1">
                <DescriptionOutlined style={{ fontSize: 14 }} />
                SOP:
              </span>
              {application.sop !== "" ? application.sop : "Not Submitted"}
            </div>

            {/* Skills */}
            {application.jobApplicant.skills &&
              application.jobApplicant.skills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {application.jobApplicant.skills.map((skill, idx) => (
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
        </div>

        {/* Right Action Column */}
        <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-2.5 lg:w-48 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <button
            type="button"
            onClick={() => getResume()}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-1.5"
          >
            <GetApp style={{ fontSize: 16 }} />
            <span>Download Resume</span>
          </button>

          <button
            type="button"
            style={{ backgroundColor: "#09BC8A" }}
            onClick={() => {
              setOpenEndJob(true);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircleOutline style={{ fontSize: 16 }} />
            <span>End Job</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Star style={{ fontSize: 16 }} className="text-amber-300" />
            <span>Rate Applicant</span>
          </button>
        </div>
      </div>

      {/* Rate Applicant Modal */}
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
                  Rate Applicant
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {application.jobApplicant.name}
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
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Job Confirmation Modal */}
      {openEndJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={handleCloseEndJob}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 sm:p-8 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseEndJob}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <CloseIcon fontSize="small" />
            </button>

            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <WarningRounded fontSize="large" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Are you sure?</h3>
            <p className="text-sm text-slate-500 mt-2">
              This will mark <span className="font-semibold text-slate-700">{application.jobApplicant.name}</span>&apos;s engagement for{" "}
              <span className="font-semibold text-slate-700">{application.job.title}</span> as finished.
            </p>

            <div className="flex items-center justify-center gap-3 mt-7">
              <button
                type="button"
                onClick={() => {
                  updateStatus("finished");
                }}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleCloseEndJob()}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AcceptedApplicants = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    sort: {
      "jobApplicant.name": {
        status: false,
        desc: false,
      },
      "job.title": {
        status: false,
        desc: false,
      },
      dateOfJoining: {
        status: true,
        desc: true,
      },
      "jobApplicant.rating": {
        status: false,
        desc: false,
      },
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    searchParams = [...searchParams, `status=accepted`];

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });

    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = `${apiList.applicants}`;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    console.log(address);

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        // console.log(err.response.data);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header & Sort Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Employees
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage accepted candidates, resumes, and active engagements
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 transition-all"
            >
              <FilterListIcon fontSize="small" />
              <span>Sort</span>
            </button>
          </div>

          {/* Employee List */}
          <div>
            {applications.length > 0 ? (
              applications.map((obj) => (
                <div key={obj._id}>
                  <ApplicationTile application={obj} getData={getData} />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <PeopleOutline />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  No Applications Found
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Accepted applicants will appear here once hired.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default AcceptedApplicants;