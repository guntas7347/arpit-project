import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  EventNote,
  SchoolOutlined,
  DescriptionOutlined,
  GetApp,
  Star,
  StarBorder,
  Close as CloseIcon,
  PersonOutline,
  AssignmentOutlined,
  CheckCircleOutline,
  CancelOutlined,
  PlaylistAddCheck,
} from "@material-ui/icons";

import { SetPopupContext } from "../../App";

import apiList, { server } from "../../lib/apiList";

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;

  if (!open) return null;

  const statusOptions = [
    { name: "rejected", label: "Rejected" },
    { name: "applied", label: "Applied" },
    { name: "shortlisted", label: "Shortlisted" },
  ];

  const sortOptions = [
    { key: "jobApplicant.name", id: "name", label: "Name" },
    {
      key: "dateOfApplication",
      id: "dateOfApplication",
      label: "Date of Application",
    },
    { key: "jobApplicant.rating", id: "rating", label: "Rating" },
  ];

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
              Filter &amp; Sort Applications
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

        {/* Application Status */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 text-sm font-semibold text-slate-700">
            Application Status
          </label>
          <div className="sm:col-span-9 flex flex-wrap gap-2.5">
            {statusOptions.map((item) => {
              const checked = Boolean(searchOptions.status[item.name]);
              return (
                <label
                  key={item.name}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium cursor-pointer select-none transition-all ${
                    checked
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={checked}
                    onChange={(event) => {
                      setSearchOptions({
                        ...searchOptions,
                        status: {
                          ...searchOptions.status,
                          [event.target.name]: event.target.checked,
                        },
                      });
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 text-sm font-semibold text-slate-700">
            Sort
          </label>
          <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {sortOptions.map((sortItem) => {
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
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      name={sortItem.id}
                      id={sortItem.id}
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
                      className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                    />
                    <label
                      htmlFor={sortItem.id}
                      className="text-xs font-medium text-slate-700 cursor-pointer select-none truncate"
                      title={sortItem.label}
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
                    className={`p-1 rounded-lg transition-colors shrink-0 ${
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

const ApplicationTile = (props) => {
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

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

  const buttonSet = {
    applied: (
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 w-full">
        <button
          type="button"
          style={{
            backgroundColor: colorSet["shortlisted"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("shortlisted")}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <PlaylistAddCheck style={{ fontSize: 16 }} />
          <span>Shortlist</span>
        </button>
        <button
          type="button"
          style={{
            backgroundColor: colorSet["rejected"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("rejected")}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <CancelOutlined style={{ fontSize: 16 }} />
          <span>Reject</span>
        </button>
      </div>
    ),
    shortlisted: (
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 w-full">
        <button
          type="button"
          style={{
            backgroundColor: colorSet["accepted"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("accepted")}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <CheckCircleOutline style={{ fontSize: 16 }} />
          <span>Accept</span>
        </button>
        <button
          type="button"
          style={{
            backgroundColor: colorSet["rejected"],
            color: "#ffffff",
          }}
          onClick={() => updateStatus("rejected")}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <CancelOutlined style={{ fontSize: 16 }} />
          <span>Reject</span>
        </button>
      </div>
    ),
    rejected: (
      <div
        className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
        style={{
          backgroundColor: colorSet["rejected"],
          color: "#ffffff",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-white/90" />
        <span>Rejected</span>
      </div>
    ),
    accepted: (
      <div
        className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
        style={{
          backgroundColor: colorSet["accepted"],
          color: "#ffffff",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-white/90" />
        <span>Accepted</span>
      </div>
    ),
    cancelled: (
      <div
        className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
        style={{
          backgroundColor: colorSet["cancelled"],
          color: "#ffffff",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-white/90" />
        <span>Cancelled</span>
      </div>
    ),
    finished: (
      <div
        className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
        style={{
          backgroundColor: colorSet["finished"],
          color: "#ffffff",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-white/90" />
        <span>Finished</span>
      </div>
    ),
  };

  const renderRating = (val) => {
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

  const educationText =
    application.jobApplicant.education &&
    application.jobApplicant.education.length > 0
      ? application.jobApplicant.education
          .map((edu) => {
            return `${edu.institutionName} (${edu.startYear}-${
              edu.endYear ? edu.endYear : "Ongoing"
            })`;
          })
          .join(", ")
      : "Not specified";

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
                {renderRating(application.jobApplicant.rating)}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
                <EventNote className="text-indigo-500" fontSize="small" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Applied On
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    {appliedOn.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 px-3 py-2 rounded-lg">
                <SchoolOutlined
                  className="text-indigo-500 mt-0.5 shrink-0"
                  fontSize="small"
                />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Education
                  </p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {educationText}
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
        <div className="flex flex-col justify-center gap-2.5 lg:w-48 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <button
            type="button"
            onClick={() => getResume()}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <GetApp style={{ fontSize: 16 }} />
            <span>Download Resume</span>
          </button>

          <div className="w-full">{buttonSet[application.status]}</div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 sm:p-8 flex flex-col items-center justify-center space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              // onClick={() => changeRating()}
              className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const JobApplications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    status: {
      all: false,
      applied: false,
      shortlisted: false,
    },
    sort: {
      "jobApplicant.name": {
        status: false,
        desc: false,
      },
      dateOfApplication: {
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

    if (searchOptions.status.rejected) {
      searchParams = [...searchParams, `status=rejected`];
    }
    if (searchOptions.status.applied) {
      searchParams = [...searchParams, `status=applied`];
    }
    if (searchOptions.status.shortlisted) {
      searchParams = [...searchParams, `status=shortlisted`];
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
    let address = `${apiList.applicants}?jobId=${jobId}`;
    if (queryString !== "") {
      address = `${address}&${queryString}`;
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
          {/* Header & Filter Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Applications
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Review candidates, download resumes, and update application stages
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 transition-all"
            >
              <FilterListIcon fontSize="small" />
              <span>Filter &amp; Sort</span>
            </button>
          </div>

          {/* Applications List */}
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
                  <AssignmentOutlined />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  No Applications Found
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try clearing your status filters or check back later for new applicants.
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

export default JobApplications;