import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  WorkOutline,
  Schedule,
  PersonOutline,
  EventAvailable,
  Star,
  StarBorder,
  Close as CloseIcon,
  Send as SendIcon,
  InboxOutlined,
} from "@material-ui/icons";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const JobTile = (props) => {
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
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

  const deadline = new Date(job.deadline).toLocaleDateString();

  const wordCount = sop
    .split(" ")
    .filter(function (n) {
      return n != "";
    }).length;

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
      <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6">
        {/* Left Job Details */}
        <div className="flex-1 space-y-4">
          {/* Header Row */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <span className="font-bold text-emerald-600 text-base">&#8377;</span>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Salary
                </p>
                <p className="font-semibold text-slate-800">
                  &#8377; {job.salary} / mo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <Schedule className="text-indigo-500" fontSize="small" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Duration
                </p>
                <p className="font-semibold text-slate-800">
                  {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <PersonOutline className="text-indigo-500" fontSize="small" />
              <div className="truncate">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Posted By
                </p>
                <p className="font-semibold text-slate-800 truncate">
                  {job.recruiter.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <EventAvailable className="text-rose-500" fontSize="small" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Deadline
                </p>
                <p className="font-semibold text-slate-800">{deadline}</p>
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
        <div className="flex md:flex-col justify-end md:justify-center md:w-40 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
            disabled={userType() === "recruiter"}
            className={`w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              userType() === "recruiter"
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow active:scale-[0.99]"
            }`}
          >
            <span>Apply</span>
          </button>
        </div>
      </div>

      {/* SOP Application Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 sm:p-8 space-y-5 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Apply for {job.title}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Write a brief Statement of Purpose highlighting why you're a great fit.
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Write SOP (upto 250 words)
                </label>
                <span
                  className={`text-xs font-medium ${
                    wordCount >= 240 ? "text-amber-600" : "text-slate-400"
                  }`}
                >
                  {wordCount} / 250 words
                </span>
              </div>
              <textarea
                rows={8}
                placeholder="Write your Statement of Purpose here..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                value={sop}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    setSop(event.target.value);
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApply()}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
              >
                <SendIcon style={{ fontSize: 16 }} />
                <span>Submit</span>
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
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FilterListIcon className="text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Filter & Sort Jobs
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
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months</option>
              <option value="4">4 Months</option>
              <option value="5">5 Months</option>
              <option value="6">6 Months</option>
              <option value="7">7 Months</option>
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

const Home = (props) => {
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
    let searchParams = [];
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

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
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
                Jobs
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore open opportunities and apply directly
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
                return <JobTile key={job._id} job={job} />;
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
                  Try adjusting your search keywords or filter criteria.
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

export default Home;