import { Link } from "react-router-dom";
import {
  WorkOutline,
  ArrowForward,
  ErrorOutline,
  HomeOutlined,
} from "@material-ui/icons";

const Welcome = (props) => {
  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 py-12">
        {/* Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
          <WorkOutline style={{ fontSize: 32 }} />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
            Your Career Starts Here
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome to <span className="text-indigo-600">Job Portal</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Discover curated opportunities, connect directly with top recruiters, and track every application in one place.
          </p>
        </div>

        {/* Quick Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/home"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
          >
            <span>Explore Jobs</span>
            <ArrowForward fontSize="small" />
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ErrorPage = (props) => {
  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10 text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
          <ErrorOutline fontSize="large" />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600">
            Page Not Found
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Error 404
          </h1>
          <p className="text-sm text-slate-500 pt-1 leading-relaxed">
            The page you are looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/home"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
          >
            <HomeOutlined fontSize="small" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;