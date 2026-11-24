import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  Schedule,
  EventNote,
  PeopleOutline,
  AssignmentIndOutlined,
  VisibilityOutlined,
  EditOutlined,
  DeleteOutline,
  Star,
  StarBorder,
  Close as CloseIcon,
  InboxOutlined,
  WarningRounded,
} from "@material-ui/icons";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const JobTile = (props) => {
  let history = useHistory();
  const { job, getData } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  console.log(jobDetails);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    history.push(location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    console.log(job._id);
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
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
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
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
        handleCloseUpdate();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  const renderRating = (rating) => {
    const validRating = rating !== -1 ? Math.round(rating) : 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= validRating ? (
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
          {rating !== -1 ? Number(rating).toFixed(1) : "Unrated"}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 mb-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-6">
        {/* Left Job Details */}
        <div className="flex-1 space-y-4">
          {/* Title & Role Badge */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {job.title}
              </h2>
              <div className="mt-1">{renderRating(job.rating)}</div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {job.jobType}
            </span>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
              <span className="font-bold text-emerald-600 text-base">&#8377;</span>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Salary
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  &#8377; {job.salary} / mo
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
                  {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
              <EventNote className="text-slate-500" fontSize="small" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Date Of Posting
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {postedOn.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
              <PeopleOutline className="text-indigo-500" fontSize="small" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Number of Applicants
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {job.maxApplicants}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg sm:col-span-2">
              <AssignmentIndOutlined
                className="text-emerald-600"
                fontSize="small"
              />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Remaining Number of Positions
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {job.maxPositions - job.acceptedCandidates}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {job.skillsets && job.skillsets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {job.skillsets.map((skill, idx) => (
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

        {/* Right Action Column */}
        <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-2.5 lg:w-52 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <button
            type="button"
            onClick={() => handleClick(`/job/applications/${job._id}`)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <VisibilityOutlined style={{ fontSize: 16 }} />
            <span>View Applications</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpenUpdate(true);
            }}
            style={{
              backgroundColor: "#FC7A1E",
              color: "#ffffff",
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <EditOutlined style={{ fontSize: 16 }} />
            <span>Update Details</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <DeleteOutline style={{ fontSize: 16 }} />
            <span>Delete Job</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 sm:p-8 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <CloseIcon fontSize="small" />
            </button>

            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <WarningRounded fontSize="large" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Are you sure?</h3>
            <p className="text-sm text-slate-500 mt-2">
              This will permanently delete <span className="font-semibold text-slate-700">{job.title}</span> and all associated job data.
            </p>

            <div className="flex items-center justify-center gap-3 mt-7">
              <button
                type="button"
                onClick={() => handleDelete()}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => handleClose()}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Details Modal */}
      {openUpdate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={handleCloseUpdate}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Update Details
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">{job.title}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseUpdate}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Application Deadline
                </label>
                <input
                  type="datetime-local"
                  value={jobDetails.deadline.substr(0, 16)}
                  onChange={(event) => {
                    handleInput("deadline", event.target.value);
                  }}
                  className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Maximum Number Of Applicants
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Positions Available
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

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCloseUpdate()}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleJobUpdate()}
                className="px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 sm:p-8 space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FilterListIcon className="text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Filter &amp; Sort Jobs
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Job Type */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 text-sm font-semibold text-slate-700">
            Job Type
          </label>
          <div className="sm:col-span-9 flex flex-wrap gap-2.5">
            {[
              { name: "fullTime", label: "Full Time" },
              { name: "partTime", label: "Part Time" },
              { name: "wfh", label: "Work From Home" },
            ].map((type) => {
              const checked = searchOptions.jobType[type.name];
              return (
                <label
                  key={type.name}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium cursor-pointer select-none transition-all ${
                    checked
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={type.name}
                    checked={checked}
                    onChange={(event) => {
                      setSearchOptions({
                        ...searchOptions,
                        jobType: {
                          ...searchOptions.jobType,
                          [event.target.name]: event.target.checked,
                        },
                      });
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{type.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 text-sm font-semibold text-slate-700">
            Salary
          </label>
          <div className="sm:col-span-9 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>&#8377; {searchOptions.salary[0] * 1000}</span>
              <span>&#8377; {searchOptions.salary[1] * 1000}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">
                  Min Salary
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={searchOptions.salary[0]}
                  onChange={(event) => {
                    const val = Math.min(
                      Number(event.target.value),
                      searchOptions.salary[1]
                    );
                    setSearchOptions({
                      ...searchOptions,
                      salary: [val, searchOptions.salary[1]],
                    });
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">
                  Max Salary
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={searchOptions.salary[1]}
                  onChange={(event) => {
                    const val = Math.max(
                      Number(event.target.value),
                      searchOptions.salary[0]
                    );
                    setSearchOptions({
                      ...searchOptions,
                      salary: [searchOptions.salary[0], val],
                    });
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0</span>
              <span>100000</span>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 text-sm font-semibold text-slate-700">
            Duration
          </label>
          <div className="sm:col-span-9">
            <select
              value={searchOptions.duration}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  duration: event.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="0">All</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </div>
        </div>

        {/* Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 text-sm font-semibold text-slate-700">
            Sort
          </label>
          <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { key: "salary", label: "Salary" },
              { key: "duration", label: "Duration" },
              { key: "rating", label: "Rating" },
            ].map((sortItem) => {
              const isActive = searchOptions.sort[sortItem.key].status;
              const isDesc = searchOptions.sort[sortItem.key].desc;
              return (
                <div
                  key={sortItem.key}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                    isActive
                      ? "border-indigo-500 bg-indigo-50/60"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={sortItem.key}
                      id={sortItem.key}
                      checked={isActive}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            [sortItem.key]: {
                              ...searchOptions.sort[sortItem.key],
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor={sortItem.key}
                      className="text-sm font-medium text-slate-700 cursor-pointer select-none"
                    >
                      {sortItem.label}
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
                          [sortItem.key]: {
                            ...searchOptions.sort[sortItem.key],
                            desc: !searchOptions.sort[sortItem.key].desc,
                          },
                        },
                      });
                    }}
                    className={`p-1 rounded-lg transition-colors ${
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

        {/* Apply Footer */}
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

const MyJobs = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [`myjobs=1`];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

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
    let address = apiList.jobs;
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
        setJobs(response.data);
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

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header & Search Controls */}
          <div className="text-center space-y-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                My Jobs
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your posted job listings, deadlines, and applicants
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Jobs..."
                  aria-label="Search Jobs"
                  value={searchOptions.query}
                  onChange={(event) =>
                    setSearchOptions({
                      ...searchOptions,
                      query: event.target.value,
                    })
                  }
                  onKeyPress={(ev) => {
                    if (ev.key === "Enter") {
                      getData();
                    }
                  }}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => getData()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label="Search"
                >
                  <SearchIcon fontSize="small" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 transition-all shrink-0"
              >
                <FilterListIcon fontSize="small" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Job List */}
          <div>
            {jobs.length > 0 ? (
              jobs.map((job) => {
                return <JobTile key={job._id} job={job} getData={getData} />;
              })
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <InboxOutlined />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  No jobs found
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Jobs you create will appear here so you can manage applications.
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

export default MyJobs;