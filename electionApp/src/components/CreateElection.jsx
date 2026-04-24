import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCreateElectionMutation } from "../apis/electionAppApi";

export default function CreateElection() {
  const electionDetails = {
    title: "",
    startDateTime: "",
    endDateTime: ""
  }

  const [form, setForm] = useState(electionDetails);
  const [createElection, { isLoading, isSuccess, isError, error }] = useCreateElectionMutation();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleChange(e) {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
    setErrors((prev) => ({...prev, [name]: ""}));
  }

  const validate = () => {
    const possibleErrors = {};

    if (!form.title.trim()) possibleErrors.title = "Election title is required.";
    if (!form.startDateTime) possibleErrors.startDateTime = "Start date & time is required.";
    if (!form.endDateTime) possibleErrors.endDateTime = "End date & time is required.";

    if (form.startDateTime && form.endDateTime) {
      if (new Date(form.endDateTime) <= new Date(form.startDateTime)) {
        possibleErrors.endDateTime = "End must be after start.";
      }
    }

    return possibleErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const possibleErrors = validate();
    if (Object.keys(possibleErrors).length > 0) {
      setErrors(possibleErrors);
      return;
    }

    try {
      const result = await createElection(form).unwrap();
      // console.log(result);
      const createdId = result?.data?.id;
      toast.success("Election created successfully!");
      navigate(`/election/${createdId}`);
    } catch (error) {
      toast.error(error?.data?.data || "Failed to create election.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <nav className="h-14 bg-blue-800 px-7 flex items-center gap-3">
        <Link
          to="/"
          className="text-white/75 text-sm no-underline flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </Link>
        <span className="text-white/30 text-sm">/</span>
        <span className="text-white text-sm">Create Election</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-130">
          <div className="mb-8">
            <h1 className="m-0 mb-2 text-[clamp(24px,4vw,32px)] font-bold text-slate-900 leading-tight tracking-[-0.02em]">
              New Election
            </h1>
            <p className="m-0 text-[15px] leading-6 text-slate-500">
              Fill in the details below. You'll be able to add positions right after.
            </p>
          </div>

          <div className="rounded-[20px] bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,82,186,0.08),0_1px_4px_rgba(0,0,0,0.04)] px-8 py-9">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="title"
                  className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600"
                >
                  Election Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Dreamdevs Election 2026"
                  required
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                />
                {errors.title ? (
                  <p className="m-0 mt-1 text-xs text-red-500 ">{errors.title}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="startDateTime"
                    className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600 "
                  >
                    Start Date & Time
                  </label>
                  <input
                    id="startDateTime"
                    type="datetime-local"
                    name="startDateTime"
                    value={form.startDateTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150  focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                  />
                  <p className="m-0 mt-1 text-xs text-slate-400 ">WAT (Africa/Lagos)</p>
                  {errors.startDateTime ? (
                    <p className="m-0 mt-1 text-xs text-red-500 ">{errors.startDateTime}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="endDateTime"
                    className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600 "
                  >
                    End Date & Time
                  </label>
                  <input
                    id="endDateTime"
                    type="datetime-local"
                    name="endDateTime"
                    value={form.endDateTime}
                    onChange={handleChange}
                    required
                    min={form.startDateTime || undefined}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150  focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                  />
                  <p className="m-0 mt-1 text-xs text-slate-400 ">Must be after start</p>
                  {errors.endDateTime ? (
                    <p className="m-0 mt-1 text-xs text-red-500 ">{errors.endDateTime}</p>
                  ) : null}
                </div>
              </div>

              {form.startDateTime && form.endDateTime && !errors.endDateTime ? (
                <div className="rounded-[10px] border border-blue-200 bg-blue-50 px-4 py-3 text-[13px] leading-6 text-blue-800 ">
                  <strong>Preview:</strong> "{form.title || "Untitled Election"}" runs from{" "}
                  {new Date(form.startDateTime).toLocaleString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  to{" "}
                  {new Date(form.endDateTime).toLocaleString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  .
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl border-0 px-4 py-3.5 text-[15px] font-bold tracking-[0.01em] text-white  transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-400 bg-blue-800 hover:bg-blue-900"
              >
                {isLoading ? "Creating..." : "Create Election"}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-[13px] text-slate-400 ">
            Positions and candidates can be added after the election is created.
          </p>
        </div>
      </div>
    </div>
  );
}
